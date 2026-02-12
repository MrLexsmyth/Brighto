import mongoose from "mongoose";
import dotenv from "dotenv";
import Property from "../src/models/Property";
import Agent from "../src/models/Agent";

dotenv.config();

const AGENT_ID = "698ca1b36676ebd13d3b115c";

const assignAgentAndUpdateAgentProps = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);

    // 1️⃣ Assign agent to all properties missing one
    const { modifiedCount } = await Property.updateMany(
      { agent: { $exists: false } },
      { $set: { agent: AGENT_ID } }
    );
    console.log(`✅ Updated ${modifiedCount} properties without agents.`);

    // 2️⃣ Get all properties now assigned to this agent
    const properties = await Property.find({ agent: AGENT_ID }, "_id");

    // 3️⃣ Update the agent document
    await Agent.findByIdAndUpdate(
      AGENT_ID,
      { properties: properties.map((p) => p._id) },
      { new: true }
    );

    console.log(`✅ Agent's properties field updated with ${properties.length} properties.`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

assignAgentAndUpdateAgentProps();
