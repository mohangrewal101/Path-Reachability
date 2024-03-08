import express from "express";
import { init } from "z3-solver";
import programAnalyzerRouter from "./routes/programAnalyzer.router";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  await testZ3();
  res.send("Hello World!");
});

app.use("/analyzeProgram", programAnalyzerRouter);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

const testZ3 = async () => {
  const { Context } = await init();
  const { Solver, Int, And } = Context("main");

  const x = Int.const("x");

  const solver = new Solver();
  solver.add(And(x.ge(0), x.le(9)));
  console.log(await solver.check());
  console.log("finished z3");
};
