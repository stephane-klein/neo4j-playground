#!/usr/bin/env node
import neo4j from "neo4j-driver";

(async () => {
    let driver

    try {
        driver = neo4j.driver(
            "neo4j://localhost:7687",
            neo4j.auth.basic("neo4j", "password")
        );
        await driver.getServerInfo()
        console.log("Connection established")
    } catch(err) {
        console.log(`Connection error\n${err}\nCause: ${err.cause}`)
    }

    console.log("Delete all nodes and edges");
    const session = driver.session();
    await session.run(`
        MATCH (n)
        DETACH DELETE n
    `);
    console.log("Delete all nodes and edges");

    console.log("Create graph nodes and edges")
    await session.run(`
        MERGE
            (a:Issue {
                iid: 1
            })
            ON CREATE set a.title="Issue 1"
        MERGE
            (b:Issue {
                iid: 2
            })
            ON CREATE set b.title="Issue 2"
        MERGE
            (c:Issue {
                iid: 3
            })
            ON CREATE set c.title="Issue 3"
        MERGE (a)-[rel1:IS_BLOCKED_BY]->(b)
        MERGE (c)-[rel2:IS_BLOCKER_BY]->(a)

        MERGE
            (e:Label {
                name: "Bug"
            })
        MERGE
            (g:Label {
                name: "Feature"
            })
        MERGE
            (h:Label {
                name: "Spike"
            })

        MERGE (a)-[rel3:LABELED_BY]->(e)
        MERGE (b)-[rel4:LABELED_BY]->(g)
        MERGE (c)-[rel5:LABELED_BY]->(g)
        MERGE (c)-[rel6:LABELED_BY]->(h)
    `);
    console.log("Graph nodes and edges created");

    console.log("\nQuery 1: find issue 1 and display its title");
    let { records } = await session.run(`
        MATCH (n:Issue {iid: 3}) RETURN n.title AS title LIMIT 25
    `);
    console.log(`    ${records[0].get("title").padStart(4)}`);

    console.log("\nQuery 2: retrieve the number of tags for issue 3");
    ({ records } = await session.run(`
        MATCH (n:Issue {iid: 3})-[r:LABELED_BY]->(n2:Label) RETURN count(r) AS count
    `));
    console.log(`   ${records[0].get("count").toInt()}`);

    console.log("\nQuery 3: retrieve all \"features\" issues");
    ({ records } = await session.run(`
        MATCH (n:Label {name: "Feature"})-[r:LABELED_BY]-(n2:Issue) RETURN n2.title AS title
    `));
    for(let record of records) {
        console.log(`    ${record.get("title")}`);
    }
    console.log("Query 4: retrieve all \"features\" issues that are not \"spikes\"");
    ({ records } = await session.run(`
        MATCH (n:Label {name: "Feature"})-[r:LABELED_BY]-(n2:Issue)
        WHERE NOT EXISTS {
            (n2)-[r2:LABELED_BY]->(n3:Label {name: "Spike"})
        }
        RETURN n2.title AS title
    `));
    for(let record of records) {
        console.log(`   ${record.get("title")}`);
    }

    console.log("\nQuery 5: retrieve all issue 3 children");
    ({ records } = await session.run(`
        MATCH (root:Issue {iid: 3})-[*]->(child:Issue)
        RETURN DISTINCT child.title AS title
    `));
    for(let record of records) {
        console.log(`    ${record.get("title")}`);
    }

    console.log("\nQuery 6: retrieve all issue 1 children");
    ({ records } = await session.run(`
        MATCH (root:Issue {iid: 1})-[*]->(child:Issue)
        RETURN DISTINCT child.title AS title
    `));
    for(let record of records) {
        console.log(`    ${record.get("title")}`);
    }

    session.close();
    driver.close();
})();
