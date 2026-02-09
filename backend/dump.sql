--
-- PostgreSQL database dump
--

\restrict kpCfX9flTyKXyUPSQ4ajQvsgCiAYe00QWmSLXGBs5U2vYnREceCfhNieO6DN9wG

-- Dumped from database version 15.15
-- Dumped by pg_dump version 15.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: asset_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.asset_type_enum AS ENUM (
    'stock',
    'etf',
    'mutual_fund',
    'bond',
    'cash'
);


ALTER TYPE public.asset_type_enum OWNER TO postgres;

--
-- Name: assettype; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.assettype AS ENUM (
    'stock',
    'etf',
    'mutual_fund',
    'bond',
    'cash'
);


ALTER TYPE public.assettype OWNER TO postgres;

--
-- Name: assettypeenum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.assettypeenum AS ENUM (
    'stock',
    'etf',
    'mutual_fund',
    'bond',
    'cash'
);


ALTER TYPE public.assettypeenum OWNER TO postgres;

--
-- Name: goal_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.goal_status_enum AS ENUM (
    'active',
    'paused',
    'completed'
);


ALTER TYPE public.goal_status_enum OWNER TO postgres;

--
-- Name: goal_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.goal_type_enum AS ENUM (
    'retirement',
    'home',
    'education',
    'custom'
);


ALTER TYPE public.goal_type_enum OWNER TO postgres;

--
-- Name: goaltype; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.goaltype AS ENUM (
    'retirement',
    'home',
    'education',
    'custom'
);


ALTER TYPE public.goaltype OWNER TO postgres;

--
-- Name: kyc_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.kyc_status_enum AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE public.kyc_status_enum OWNER TO postgres;

--
-- Name: kycstatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.kycstatus AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE public.kycstatus OWNER TO postgres;

--
-- Name: risk_profile_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.risk_profile_enum AS ENUM (
    'conservative',
    'moderate',
    'aggressive'
);


ALTER TYPE public.risk_profile_enum OWNER TO postgres;

--
-- Name: riskprofile; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.riskprofile AS ENUM (
    'conservative',
    'moderate',
    'aggressive'
);


ALTER TYPE public.riskprofile OWNER TO postgres;

--
-- Name: transaction_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.transaction_type_enum AS ENUM (
    'buy',
    'sell',
    'dividend',
    'contribution',
    'withdrawal'
);


ALTER TYPE public.transaction_type_enum OWNER TO postgres;

--
-- Name: transactiontype; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.transactiontype AS ENUM (
    'buy',
    'sell',
    'dividend',
    'contribution',
    'withdrawal'
);


ALTER TYPE public.transactiontype OWNER TO postgres;

--
-- Name: transactiontypeenum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.transactiontypeenum AS ENUM (
    'buy',
    'sell',
    'dividend',
    'contribution',
    'withdrawal'
);


ALTER TYPE public.transactiontypeenum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: goals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.goals (
    id integer NOT NULL,
    user_id integer,
    goal_type public.goal_type_enum,
    target_amount numeric,
    target_date date,
    monthly_contribution numeric,
    status public.goal_status_enum DEFAULT 'active'::public.goal_status_enum,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.goals OWNER TO postgres;

--
-- Name: goals_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.goals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.goals_id_seq OWNER TO postgres;

--
-- Name: goals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.goals_id_seq OWNED BY public.goals.id;


--
-- Name: investments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.investments (
    id integer NOT NULL,
    user_id integer,
    asset_type public.asset_type_enum,
    symbol character varying(20),
    units numeric,
    avg_buy_price numeric,
    cost_basis numeric,
    current_value numeric,
    last_price numeric,
    last_price_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    unrealized_pnl numeric(20,8) DEFAULT 0,
    pnl_percent numeric(10,6) DEFAULT 0,
    one_year_return_rate numeric(10,4)
);


ALTER TABLE public.investments OWNER TO postgres;

--
-- Name: investments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.investments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.investments_id_seq OWNER TO postgres;

--
-- Name: investments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.investments_id_seq OWNED BY public.investments.id;


--
-- Name: recommendations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recommendations (
    id integer NOT NULL,
    user_id integer,
    title character varying(100),
    recommendation_text text,
    suggested_allocation jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.recommendations OWNER TO postgres;

--
-- Name: recommendations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.recommendations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.recommendations_id_seq OWNER TO postgres;

--
-- Name: recommendations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.recommendations_id_seq OWNED BY public.recommendations.id;


--
-- Name: simulations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.simulations (
    id integer NOT NULL,
    user_id integer,
    goal_id integer,
    scenario_name character varying(100),
    assumptions jsonb,
    results jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.simulations OWNER TO postgres;

--
-- Name: simulations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.simulations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.simulations_id_seq OWNER TO postgres;

--
-- Name: simulations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.simulations_id_seq OWNED BY public.simulations.id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    id integer NOT NULL,
    user_id integer,
    symbol character varying(20),
    type public.transaction_type_enum,
    quantity numeric,
    price numeric,
    fees numeric,
    executed_at timestamp without time zone,
    asset_type public.asset_type_enum,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.transactions_id_seq OWNER TO postgres;

--
-- Name: transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transactions_id_seq OWNED BY public.transactions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100),
    email character varying(100) NOT NULL,
    password character varying(255),
    risk_profile public.risk_profile_enum,
    kyc_status public.kyc_status_enum DEFAULT 'unverified'::public.kyc_status_enum,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    wallet_balance numeric(18,2) DEFAULT 0
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: goals id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goals ALTER COLUMN id SET DEFAULT nextval('public.goals_id_seq'::regclass);


--
-- Name: investments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.investments ALTER COLUMN id SET DEFAULT nextval('public.investments_id_seq'::regclass);


--
-- Name: recommendations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendations ALTER COLUMN id SET DEFAULT nextval('public.recommendations_id_seq'::regclass);


--
-- Name: simulations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.simulations ALTER COLUMN id SET DEFAULT nextval('public.simulations_id_seq'::regclass);


--
-- Name: transactions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: goals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.goals (id, user_id, goal_type, target_amount, target_date, monthly_contribution, status, created_at) FROM stdin;
1	1	retirement	500000.0	2035-12-31	10000.0	active	2025-12-31 16:44:48.069087
2	2	education	2000000.0	2028-12-31	20000.0	active	2025-12-31 16:46:14.443589
5	3	custom	150000.0	2027-12-31	15000.0	active	2025-12-31 17:20:41.337194
8	8	education	250000.0	2027-02-19	20000.0	active	2026-01-20 16:32:33.331867
10	8	home	800000.0	2028-10-04	25000.0	active	2026-02-04 16:53:35.248659
\.


--
-- Data for Name: investments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.investments (id, user_id, asset_type, symbol, units, avg_buy_price, cost_basis, current_value, last_price, last_price_at, created_at, updated_at, unrealized_pnl, pnl_percent, one_year_return_rate) FROM stdin;
19	8	stock	AAPL	10	259.4800	2594.8000	2764.899902343750	276.489990234375	2026-02-05 19:45:01.353654	2026-02-01 20:56:17.991468	2026-02-05 19:45:01.077512	0.00000000	0.000000	19.4737
27	8	stock	META	2	668.989990234375	1337.979980468750	1337.979980468750	668.989990234375	2026-02-05 19:45:01.529755	2026-02-05 15:02:58.428503	2026-02-05 19:45:01.077512	0.00000000	0.000000	-4.7910
\.


--
-- Data for Name: recommendations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recommendations (id, user_id, title, recommendation_text, suggested_allocation, created_at) FROM stdin;
\.


--
-- Data for Name: simulations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.simulations (id, user_id, goal_id, scenario_name, assumptions, results, created_at) FROM stdin;
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transactions (id, user_id, symbol, type, quantity, price, fees, executed_at, asset_type, created_at) FROM stdin;
21	8	AAPL	buy	10	259.4800	0	\N	stock	2026-02-01 20:56:17.991468
36	8	META	buy	2	668.989990234375	0	\N	stock	2026-02-05 15:02:58.428503
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, risk_profile, kyc_status, created_at, wallet_balance) FROM stdin;
1	Navin	navin123@example.com	12345678	moderate	unverified	2025-12-31 16:15:16.825218	0.00
2	jjj	jjj@example.com	jjj12345	moderate	unverified	2025-12-31 16:22:40.335564	0.00
3	nani	nani@example.com	12345678	aggressive	unverified	2025-12-31 17:19:16.358425	0.00
4	chinna	chinna@example.com	$2b$12$ZRbvlv/vNv2xK7OVWgyHAeKsCcjv4pBOWFhM9fNueHd3KD/X7d6yi	moderate	unverified	2026-01-06 18:34:05.45368	0.00
5	chintu	demo@example.com	$2b$12$r.z4r5cR7B15MYvJIakgK.82QWgaDCRPPvSxvCj.30PPq3OhGgbxW	moderate	unverified	2026-01-06 19:14:50.993317	0.00
6	john	john@example.com	$2b$12$ULqzw8/hcphT2XCMc0eLl.FU6JnfRWeXqZtcoFm6ZKrojnKjJs6Nq	moderate	unverified	2026-01-11 12:13:14.322442	0.00
7	ram	ram@example.com	$2b$12$3f0xUaCTEGNTMewhFBRdweOKBEJQqfUnLavtjU6J15srfYgKM47C6	moderate	unverified	2026-01-11 13:22:40.731139	0.00
9	sweety	sweety@example.com	$2b$12$XQcBH9FTEP1yK4nVVS72HOZVbVJpOe4g1XPuteeaUaBKD3Z8GFLW6	moderate	unverified	2026-01-12 15:22:12.638367	0.00
10	chotu	chotu@example.com	$2b$12$mmqkLEjn8KqOZl9Bxm44tuyZfqXQbHQVTvuGCKLfrUxeZbDgfkrQG	moderate	unverified	2026-01-12 17:16:37.363965	0.00
11	dem0123	demo123@example.com	$2b$12$vCrMrWqdaNSqyZxTAKG5U.0pRrAgWxvJAPkXdGebiaavYyLRtIWQ6	moderate	unverified	2026-01-12 19:14:50.212358	0.00
12	john	john@gmail.com	$2b$12$Ymj3a.zTRpBMncBKalLuxO51KBEU4muOqn0NcXcvomTqmBtLgp1Aa	moderate	unverified	2026-01-22 17:25:03.411516	0.00
13	doe	doe@gmail.com	$2b$12$wEJJCCmLCkt.FAAQT6slWO3FG9aViO2I7Fv3vFVOB9dO4rQ8Bf4xy	moderate	unverified	2026-01-22 17:53:28.291624	0.00
14	Test User	test1@example.com	$2b$12$UDYxdG5/hBqhztXESS/SOOUUQIigDTHDSYK54Y33Y2k3V/XxPDrZu	moderate	unverified	2026-02-03 14:48:35.039378	0.00
8	krish	krish@example.com	$2b$12$2qlRG7nN3U5Io76RdX01Yeuo8sA58xeB5gK0FFU9Lv1U3vWT1P7bu	moderate	unverified	2026-01-12 15:20:16.592416	262.97
\.


--
-- Name: goals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.goals_id_seq', 10, true);


--
-- Name: investments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.investments_id_seq', 27, true);


--
-- Name: recommendations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.recommendations_id_seq', 1, false);


--
-- Name: simulations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.simulations_id_seq', 1, false);


--
-- Name: transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transactions_id_seq', 36, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 14, true);


--
-- Name: goals goals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goals
    ADD CONSTRAINT goals_pkey PRIMARY KEY (id);


--
-- Name: investments investments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.investments
    ADD CONSTRAINT investments_pkey PRIMARY KEY (id);


--
-- Name: recommendations recommendations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendations
    ADD CONSTRAINT recommendations_pkey PRIMARY KEY (id);


--
-- Name: simulations simulations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.simulations
    ADD CONSTRAINT simulations_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_investments_user_symbol; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_investments_user_symbol ON public.investments USING btree (user_id, symbol);


--
-- Name: idx_transactions_user_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_transactions_user_time ON public.transactions USING btree (user_id, executed_at DESC);


--
-- Name: goals goals_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goals
    ADD CONSTRAINT goals_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: investments investments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.investments
    ADD CONSTRAINT investments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: recommendations recommendations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommendations
    ADD CONSTRAINT recommendations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: simulations simulations_goal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.simulations
    ADD CONSTRAINT simulations_goal_id_fkey FOREIGN KEY (goal_id) REFERENCES public.goals(id);


--
-- Name: simulations simulations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.simulations
    ADD CONSTRAINT simulations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: transactions transactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict kpCfX9flTyKXyUPSQ4ajQvsgCiAYe00QWmSLXGBs5U2vYnREceCfhNieO6DN9wG

