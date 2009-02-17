---
layout: post
title: "Using Rails-like Environments with Spring"
topics: java
---
One thing that's nice about Rails is the separation of test, development and production environment right from the beginning. I'm currently working on a Java project with Spring and found myself using MySQL for most of the development and testing and Oracle in production. Using Hibernate that's not a big problem (most of the time that is, unless you're bitten in the ass by another weird Oracle JDBC driver bug), but I don't want to change all the properties for every deployment.

There's a neat trick to achieve a similar functionality using Spring. As you do in Rails you basically put all the properties that are different in every environments into separate files, e.g.

    project-test.properties
    project-development.properties
    project-production.properties

First thing that comes to mind is the specification of the database connection properties and Hibernate specifics.

    jdbc.url=jdbc:mysql://localhost/my_database_test
    jdbc.user=scott
    jdbc.password=tiger
    jdbc.driver=com.mysql.jdbc.Driver
    hibernate.dialect=org.hibernate.dialect.MySQL5Dialect

I also put in web service configurations so that I can use different configurations or even mock services during development.

Now let's have a look at the Spring configuration. The important part is the configuration of a PropertyPlaceHolderConfigurer. Basically, that's the class that is responsible for resolving the properties which I'll use in the XML configuration later on.

    <bean id="propertyConfigurer" 
          class="org.springframework.beans.factory.config.PropertyPlaceholderConfigurer">
      <property name="systemPropertiesMode" value="1"/>
      <property name="locations">
        <list>
          <value>classpath:project-production.properties</value>
          <value>classpath:project-development.properties</value>
          <value>classpath:project-test.properties</value>
        </list>
      </property>
      <property name="ignoreResourceNotFound" value="true"/>
    </bean>

This will read read all the properties from the listed properties files. The rule is that the properties in the last file win, so development overwrites production, and test overwrites development. One thing to mention is the property `ignoreResourceNotFound` which defaults to `false`. That way the configurer throws an exception when he can't find one of the properties files. I set it to true so that I can just remove the test file for the development environment and the development file for the production environment.

You can put these files in your JAR file, or into WEB-INF/classes. My setup puts the project-test.properties into my test/ folder so that it's not even included in the deployment. For a production deployment I just remove the development file during the build and I'm good to go.

What you can now do in your configuration is this

    <bean id="dataSource"
          class="org.apache.commons.dbcp.BasicDataSource"
          destroy-method="close">
      <property name="driverClassName" value="${jdbc.driver}"/>
      <property name="url" value="${jdbc.url}"/>
      <property name="username" value="${jdbc.user}"/>
      <property name="password" value="${jdbc.password}"/>
    </bean>

    <bean id="sessionFactory">
    <bean id="sessionFactory"
          class="org.springframework.orm.hibernate3.LocalSessionFactoryBean">
      <property name="dataSource" ref="dataSource"/>
      <property name="hibernateProperties">
        <props>
          <prop key="hibernate.dialect">${hibernate.dialect}</prop>
        </props>
      </property>
    </bean>

These properties can also be used to configure bean references. For testing and development I use a mocked web service implementation which I can switch through the property

    web.service=mockedWebService

If I have defined a bean with the id `mockedWebService` I can now safely use a property to reference it.

    <bean id="someService"
          class="some.Class">
      <property name="webService" ref="${web.service}"/>
    </bean>

You can even specify properties files based on system properties:

    <bean id="propertyConfigurer" 
          class="org.springframework.beans.factory.config.PropertyPlaceholderConfigurer">
      <property name="systemPropertiesMode" value="1"/>
      <property name="locations">
        <list>
          <value>classpath:project-${environment}.properties</value>
          <value>classpath:project-${user.name}</value>
        </list>
      </property>
      <property name="ignoreResourceNotFound" value="true"/>
    </bean>

If you add the property environment to the startup command of whatever you're using you can specify the environment during startup, or use an approach based on the login user's name.

While not a perfect solution I found it to be a lot easier to work with than editing Spring configuration by hand or having a separate XML configuration for the different stages.