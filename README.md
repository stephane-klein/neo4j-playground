# Neo4j playground

I created this playground to experiment for the first time how to use [Neo4j](https://en.wikipedia.org/wiki/Neo4j).

```sh
$ docker compose up -d --wait
$ docker compose logs -f
neo4j-1  | Warning: Folder mounted to "/data" is not writable from inside container. Changing folder owner to neo4j.
neo4j-1  | Changed password for user 'neo4j'. IMPORTANT: this change will only take effect if performed before the database is started for the first time.
neo4j-1  | 2024-03-28 22:14:40.963+0000 INFO  Logging config in use: File '/var/lib/neo4j/conf/user-logs.xml'
neo4j-1  | 2024-03-28 22:14:40.978+0000 INFO  Starting...
neo4j-1  | 2024-03-28 22:14:41.832+0000 INFO  This instance is ServerId{51659ae7} (51659ae7-1034-4a75-a2c0-e7e998330498)
neo4j-1  | 2024-03-28 22:14:42.414+0000 INFO  ======== Neo4j 5.18.1 ========
neo4j-1  | 2024-03-28 22:14:44.121+0000 INFO  Bolt enabled on 0.0.0.0:7687.
neo4j-1  | 2024-03-28 22:14:44.683+0000 INFO  HTTP enabled on 0.0.0.0:7474.
neo4j-1  | 2024-03-28 22:14:44.683+0000 INFO  Remote interface available at http://localhost:7474/
neo4j-1  | 2024-03-28 22:14:44.686+0000 INFO  id: 2A4DF37D9F3A0DB0B1AFE3655459862CAD951C5823295ECA8FA9C0B9278C4A3C
neo4j-1  | 2024-03-28 22:14:44.686+0000 INFO  name: system
neo4j-1  | 2024-03-28 22:14:44.686+0000 INFO  creationDate: 2024-03-28T22:14:43.028Z
neo4j-1  | 2024-03-28 22:14:44.686+0000 INFO  Started.
```

```sh
$ mise install
$ pnpm install
```
In the [`playground.js`](./playground.js) script, I tried (successfully) to write queries on a schema representing "Issues" and "Labels".

This enabled me to discover and test [Cypher](https://en.wikipedia.org/wiki/Cypher_(query_language))'s grahp query language.

```sh
$ ./playground.js
Connection established
Delete all nodes and edges
Delete all nodes and edges
Create graph nodes and edges
Graph nodes and edges created

Query 1: find issue 1 and display its title
    Issue 3

Query 2: retrieve the number of tags for issue 3
   2

Query 3: retrieve all "features" issues
    Issue 3
    Issue 2
Query 4: retrieve all "features" issues that are not "spikes"
   Issue 2

Query 5: retrieve all issue 3 children
    Issue 1
    Issue 2

Query 6: retrieve all issue 1 children
    Issue 2
```

I've been using databases for 25 years and this is the first time I've tested a [graph-oriented database](https://en.wikipedia.org/wiki/Graph_database) 🫤!

I feel like I've missed out on something very practical.

Having successfully implemented this POC based on Neo4j, I've implemented the same thing [here](https://github.com/stephane-klein/apache-age-playground) based on the PostgreSQL extension named [Apache Age](https://github.com/apache/age). 
