-- Database: Todos

CREATE DATABASE "Todos"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

CREATE TABLE logins (
  ID SERIAL PRIMARY KEY,
  username VARCHAR(30),
  password VARCHAR(30)
);

insert into logins (username, password) values ('success_login', 'success_password')

CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  user_id SERIAL,
  title VARCHAR(30),
  completed BOOLEAN,
  constraint fk_user_id
  	foreign key(user_id)
	  references logins(id)
);

CREATE TABLE suggestions (
  ID SERIAL PRIMARY KEY,
  title VARCHAR(30)
);

insert into suggestions (title) values ('buy milk')
insert into suggestions (title) values ('buy cheese')
insert into suggestions (title) values ('go to the gym')
insert into suggestions (title) values ('clean the house')
