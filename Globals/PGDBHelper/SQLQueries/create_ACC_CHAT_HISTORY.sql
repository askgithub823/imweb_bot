CREATE TABLE postgres."ACC_CHAT_HISTORY"
(
    "ID" bigserial NOT NULL,
    "USER_ID" character varying(50) NOT NULL,
    "CREATED_AT" timestamp with time zone NOT NULL DEFAULT NOW(),
    "CHAT" json NOT NULL,
    PRIMARY KEY ("ID")
)
WITH (
    OIDS = FALSE
);

ALTER TABLE postgres."ACC_CHAT_HISTORY"
    OWNER to techforceadmin;
