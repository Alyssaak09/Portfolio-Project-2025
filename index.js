import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { MongoClient, ObjectId } from "mongodb";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8888;

// Connect to MONGODB
const client = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017");
await client.connect();
const db = client.db("portfolioprojects");

// MIDDLEWARE Setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Public Routes

app.get("/", async (req, res) => {
  const projects = await db.collection("projects").find().toArray();
  res.render("index", { title: "Admin Dashboard", projects });
});

app.get("/about", async (req, res) => {
  const abouts = await db.collection("abouts").find().toArray();
  res.render("about", { title: "About", abouts });
});

app.get("/projects", async (req, res) => {
  const projects = await db.collection("projects").find().toArray();
  res.render("projects", { title: "Projects", projects });
});

app.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact", success: req.query.success === 'true' });
});

// Contact Form Submission
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await db.collection("contacts").insertOne({
      name,
      email,
      message,
      submittedAt: new Date()
    });
    res.redirect("/contact?success=true");
  } catch (err) {
    console.error("Failed to submit contact form:", err);
    res.status(500).send("There was a problem submitting your message.");
  }
});

app.get("/admin", (req, res) => {
  res.render("admin-dashboard", { title: "Admin Dashboard" });
});

// ADMIN Routes
app.get("/admin/contacts", async (req, res) => {
  const contacts = await db.collection("contacts").find().sort({ submittedAt: -1 }).toArray();
  res.render("admin-contacts", { title: "Contact Submissions", contacts });
});

// About CRUD 
app.get("/admin/about", async (req, res) => {
  const abouts = await db.collection("abouts").find().toArray();
  const editAbout = req.query.edit
    ? await db.collection("abouts").findOne({ _id: new ObjectId(req.query.edit) })
    : null;
  res.render("about", { title: "Manage About", abouts, editAbout });
});

app.post("/admin/about", async (req, res) => {
  if (req.body.id) {
    await db.collection("abouts").updateOne(
      { _id: new ObjectId(req.body.id) },
      { $set: { content: req.body.content } }
    );
  } else {
    await db.collection("abouts").insertOne({ content: req.body.content });
  }
  res.redirect("/admin/about");
});

app.get("/admin/about/delete", async (req, res) => {
  await db.collection("abouts").deleteOne({ _id: new ObjectId(req.query.id) });
  res.redirect("/admin/about");
});

// Projects CRUD 
app.get("/admin/projects", async (req, res) => {
  const projects = await db.collection("projects").find().toArray();
  const editProject = req.query.edit
    ? await db.collection("projects").findOne({ _id: new ObjectId(req.query.edit) })
    : null;
  res.render("projects", { title: "Manage Projects", projects, editProject });
});

app.post("/admin/projects", async (req, res) => {
  const { id, title, description, link, skills } = req.body;
  const skillsArray = skills ? skills.split(",").map(s => s.trim()) : [];

  const projectData = { title, description, link, skills: skillsArray };

  if (id) {
    await db.collection("projects").updateOne(
      { _id: new ObjectId(String(id)) },
      { $set: projectData }
    );
  } else {
    await db.collection("projects").insertOne(projectData);
  }
  res.redirect("/admin/projects");
});

app.get("/admin/projects/delete", async (req, res) => {
  await db.collection("projects").deleteOne({ _id: new ObjectId(req.query.id) });
  res.redirect("/admin/projects");
});

// API Routes

app.get("/api/about", async (req, res) => {
  try {
    const abouts = await db.collection("abouts").find().toArray();
    res.json(abouts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch about data" });
  }
});

app.get("/api/projects", async (req, res) => {
  try {
    const projects = await db.collection("projects").find().toArray();
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch project data" });
  }
});

// Contact API

app.get("/api/contacts", async (req, res) => {
  try {
    const contacts = await db.collection("contacts").find().sort({ submittedAt: -1 }).toArray();
    res.json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch contact data" });
  }
});

app.post("/api/contacts", async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const result = await db.collection("contacts").insertOne({
      name,
      email,
      message,
      submittedAt: new Date()
    });
    res.status(201).json({ message: "Contact message saved", id: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save contact message" });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
