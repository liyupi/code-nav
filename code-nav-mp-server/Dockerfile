FROM java:8

VOLUME /tmp

ADD ./target/code-nav-mp-server-0.0.1.jar code-nav-mp-server.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "code-nav-mp-server.jar", "--spring.profiles.active=prod"]
