---
layout: post
title: "Storing Images with Oracle and Hibernate"
topics: java oracle
---
All I wanted was to store images in the database through Hibernate. It all look so easy. Add a byte array property, add it as a binary type to the Hibernate mapping and off you go. So far so good. I'm developing with MySQL where everything worked the way it's supposed to. Image data goes into the database and comes out when required, no problem.

Enter Oracle. The first fetching of data from the database worked like a charm, but the second brought up a nice ORA error. ORA-17027: Stream has already been closed. Good stuff. Digging through the result on Google it seems that I'm not the only one having this problem. The Hibernate gang is quick enough to point out that the error lies with the Oracle JDBC driver. The problem is that a the default type for byte arrays with the OracleDialect is `long raw`. When a query is fired with a stream column (e.g. long raw) in the field list it has to be read last, or else the stream will be closed once the next column is read.

One suggestion was to put the corresponding column to the end of the mapping file, but that didn't work at all for me. Another one was to use a different JDBC driver. All that didn't work for me, but there had to be a way.

According to [Hanson Char](http://hansonchar.blogspot.com/) the solution is to use a blob to store the byte array. Since you can't just set the type of the property to blob and be done with it, [he offers](http://hansonchar.blogspot.com/2005_06_01_hansonchar_archive.html#111941318291641765) a simple solution: add blob handling to your model. I tried it and it works. The thing I didn't like about it was to have all that stuff from the JDBC packages in my model, so I tried to put it into a UserType. It does work to a certain extent, but since you don't have direct access to the session in it I couldn't implement everything Hibernate's own BlobType does. Respecting the hibernate.jdbc.use_streams_for_binary is probably the most important thing.

So I just derived a combination of Hanson's Code and Hibernate's BlobType wrapped it into a [ByteBlobType](http://www.paperplanes.de/files/ByteBlobType.java). It uses most of the BlobType implementation and only wraps the conversion between byte array and blob.

Just before I was done I had a look what kinds of subclasses of UserType lurks around in my project. It didn't really surprise me, but of course Spring offers a type to do just that, but Spring-style. Doh! It's called [BlobByteArrayType](http://static.springframework.org/spring/docs/2.0.x/api/org/springframework/orm/hibernate3/support/BlobByteArrayType.html). Though it can be used as a normal Hibernate type, it needs an additional property set in your session factory provided by Spring's LocalSessionFactoryBean, a LobHandler. That's a no-brainer though and can be done quite easily:

     <bean id="sessionFactory"
          class="org.springframework.orm.hibernate3.LocalSessionFactoryBean">
       .....
       <property name="lobHandler" ref="defaultLobHandler"/>
     </bean>

     <bean id="defaultLobHandler" 
           class="org.springframework.jdbc.support.lob.DefaultLobHandler"
           lazy-init="true"/>

That should work for most databases, of course not with all versions of Oracle. For the latter you're better off using the [OracleLobHandler](http://static.springframework.org/spring/docs/2.0.x/api/org/springframework/jdbc/support/lob/OracleLobHandler.html). The [default handler](http://static.springframework.org/spring/docs/2.0.x/api/org/springframework/jdbc/support/lob/DefaultLobHandler.html) works with Oracle 10g to a certain extent which I can confirm, but apparently not all of it. If you're not using Spring, then the above ByteBlobType might be an option for you.