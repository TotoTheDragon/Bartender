CREATE TABLE quantity (
	id serial,
	quantity_value int,
	quantity_amount int,
	quantity_unit varchar,
	PRIMARY KEY (quantity_value, quantity_amount, quantity_unit)
);

CREATE TABLE product (
	gtin char(14) PRIMARY KEY NOT NULL,
	name varchar,
	description varchar,
	brand varchar,
	category varchar,
	images jsonb,
	quantity_id int REFERENCES quantity (id)
);

CREATE TYPE attribute_type AS ENUM (
	'text',
	'integer',
	'float',
	'boolean'
);

CREATE TABLE product_attributes (
	gtin char(14) PRIMARY KEY REFERENCES product,
	name varchar,
	type attribute_type,
	text_value varchar,
	integer_value int,
	float_value float,
	boolean_value boolean
);

CREATE UNIQUE INDEX ON product_attributes (attribute_name);

