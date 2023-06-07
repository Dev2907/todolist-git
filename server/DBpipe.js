const { MongoClient, ObjectId } = require("mongodb");

const url = "mongodb://localhost:27017/";
const dbName = "TODO";

const collections = ["Users", "Lists", "all-tasks", "group", "steps"];

async function getFromDB(queryObj, ...mode) {
  try {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    const collection = client.db(dbName).collection(collections[mode[0]]);
    if (mode.length > 1 && mode[1] === 1) {
      //for group and lists when only names are needed use mode as X,1
      const projection = { name: 1 };
      return await collection.find(queryObj, { projection }).toArray();
    }

    return await collection.find(queryObj).toArray();
  } catch (err) {
    console.log(err);
    return [];
  }
}

async function insertToDB(queryObj, mode) {
  try {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    const collection = client.db(dbName).collection(collections[mode]);
    collection.insertOne(queryObj);
  } catch (err) {
    console.log(err);
  }
}

async function updateDB(ID, queryObj, ...mode) {
  try {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    const collection = client.db(dbName).collection(collections[mode]);
    collection.updateOne({ _id: new ObjectId(ID) }, { $set: queryObj });
  } catch (err) {
    console.log(err);
  }
}
async function deletefromDB(queryObj, ...mode) {
  try {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    const collection = client.db(dbName).collection(collections[mode]);
    collection.deleteOne(queryObj, (err, res) => {
      if (err) {
        console.log(err);
      }
    });
  } catch (err) {
    console.log(err);
  }
}

async function updatemanyDB(queryObj, ...mode) {
  try {
    console.log(queryObj.taskid);
    const client = new MongoClient(url, { useUnifiedTopology: true });
    const collection = client.db(dbName).collection(collections[mode]);
    collection.updateMany(
      { contents: { $in: [`${queryObj.taskid}`] } },
      { $pull: { contents: `${queryObj.taskid}` } },
      (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`${res} documents updated`);
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
}
async function pushtasklist(queryObj, ...mode) {
  try {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    const collection = client.db(dbName).collection(collections[mode]);
    collection.updateOne(
      { _id: new ObjectId(queryObj.id) },
      { $push: { contents: `${queryObj.taskid}` } },
      (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`${res} documents updated`);
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getFromDB,
  insertToDB,
  updateDB,
  deletefromDB,
  updatemanyDB,
  pushtasklist,
};
