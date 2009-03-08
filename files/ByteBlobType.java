package de.paperplanes.hibernate;

import org.hibernate.Hibernate;
import org.hibernate.HibernateException;
import org.hibernate.engine.SessionImplementor;
import org.hibernate.lob.BlobImpl;
import org.hibernate.lob.SerializableBlob;
import org.hibernate.type.BlobType;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.*;

/**
 * A Hibernate type to store byte arrays in blobs.
 * Default for binary data for the Oracle dialect is long raw which can lead
 * to weird errors, especially ORA-17027.
 * 
 * @author: Mathias Meyer <meyer@paperplanes.de> with inspiration by Hanson Char
 * (http://hansonchar.blogspot.com/2005_06_01_hansonchar_archive.html - scroll down to
 * "Oracle Blob mapped to byte[] in Hibernate")
 */
 /**
  * A Hibernate type to store byte arrays in blobs.
  * Default for binary data for the Oracle dialect is long raw which can lead
  * to weird errors, especially ORA-17027.
  * 
  * @author: Mathias Meyer <meyer@paperplanes.de> with inspiration by Hanson Char
  * (http://hansonchar.blogspot.com/2005_06_01_hansonchar_archive.html - scroll down to
  * "Oracle Blob mapped to byte[] in Hibernate")
  */
 public class ByteBlobType extends BlobType {
   public int[] sqlTypes() {
     return new int[] {Types.BLOB};
   }

   public Class getReturnedClass() {
     return byte[].class;
   }

   public String getName() {
     return "byteblob";
   }

   public Object get(ResultSet resultSet, String name) throws HibernateException, SQLException {
     Blob data = resultSet.getBlob(name);
     if (resultSet.wasNull()) {
       return null;
     }

     ByteArrayOutputStream baos = new ByteArrayOutputStream();
     try {
       byte[] buf = new byte[(int) data.length()];
       InputStream is = data.getBinaryStream();
       try {
         for (; ;) {
           int dataSize = is.read(buf);

           if (dataSize == -1)
             break;
           baos.write(buf, 0, dataSize);
         }
       } finally {
         if (is != null) {
           try {
             is.close();
           } catch (IOException ex) {
           }
         }
       }
       return baos.toByteArray();
     } catch (SQLException e) {
       throw new RuntimeException(e);
     } catch (IOException e) {
       throw new RuntimeException(e);
     } finally {
       if (baos != null) {
         try {
           baos.close();
         } catch (IOException ex) {
         }
       }
     }
   }

   public void set(PreparedStatement statement, Object value, int index, SessionImplementor session) throws HibernateException, SQLException {
     if (value == null) {
       statement.setNull(index, Types.BLOB);
     } else {
       byte [] data = (byte[]) value;
       super.set(statement, Hibernate.createBlob(data), index, session);
     }
   }
 }

