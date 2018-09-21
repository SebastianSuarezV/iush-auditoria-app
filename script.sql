create table empresas
(
  ID     bigint auto_increment,
  nombre varchar(100) not null,
  nit    varchar(100) not null,
  constraint empresas_ID_uindex
  unique (ID)
);

alter table empresas
  add primary key (ID);

create table normas
(
  ID     bigint auto_increment,
  nombre varchar(100) not null,
  constraint norma_ID_uindex
  unique (ID)
);

alter table normas
  add primary key (ID);

create table preguntas
(
  ID       bigint auto_increment,
  texto    varchar(100) not null,
  norma_id bigint       not null,
  constraint pregunta_ID_uindex
  unique (ID),
  constraint pregunta_norma_fk
  foreign key (norma_id) references normas (ID)
    on update cascade
    on delete cascade
);

alter table preguntas
  add primary key (ID);

create table sessions
(
  session_id varchar(128) collate utf8mb4_bin not null
    primary key,
  expires    int(11) unsigned                 not null,
  data       text collate utf8mb4_bin         null
);

create table usuarios
(
  ID      bigint auto_increment,
  usuario varchar(100) not null,
  clave   varchar(100) not null,
  constraint usuarios_ID_uindex
  unique (ID),
  constraint usuarios_usuario_uindex
  unique (usuario)
);

alter table usuarios
  add primary key (ID);

create table auditorias
(
  ID         bigint auto_increment,
  empresa_id bigint not null,
  norma_id   bigint not null,
  fecha      date   not null,
  auditor_id bigint not null,
  constraint auditorias_ID_uindex
  unique (ID),
  constraint auditorias_auditor_fk
  foreign key (auditor_id) references usuarios (ID)
    on update cascade
    on delete cascade,
  constraint auditorias_empresa_fk
  foreign key (empresa_id) references empresas (ID)
    on update cascade
    on delete cascade,
  constraint auditorias_norma_fk
  foreign key (norma_id) references normas (ID)
    on update cascade
    on delete cascade
);

alter table auditorias
  add primary key (ID);

create table respuestas
(
  ID           bigint auto_increment,
  auditoria_id bigint not null,
  pregunta_id  bigint not null,
  repuesta     int(1) not null,
  constraint respuestas_ID_uindex
  unique (ID),
  constraint respuestas_auditoria_fk
  foreign key (auditoria_id) references auditorias (ID)
    on update cascade
    on delete cascade,
  constraint respuestas_pregunta_fk
  foreign key (pregunta_id) references preguntas (ID)
    on update cascade
    on delete cascade
);

alter table respuestas
  add primary key (ID);


