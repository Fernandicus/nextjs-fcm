// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  console.log("FROM SERVER", req.body);
  console.log("Add user token to the DB...")
  res.status(200).json({ name: "John Doe" });
}
