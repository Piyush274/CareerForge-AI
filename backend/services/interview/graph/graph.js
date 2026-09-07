import { END, START, StateGraph } from "@langchain/langgraph";
import InterviewState from "./state.js";
import { feedbackNode, interviewNode, summaryNode } from "./nodes.js";

function routeInitialAction(state) {
  if (state.action === "start") {
    return "generateQuestions";
  }
  if (state.action === "feedback") {
    return "evaluateAnswer";
  }
  return END;
}

function routeAfterFeedback(state) {
  if (state.completed) {
    return "generateSummary";
  }
  return END;
}

const graph = new StateGraph(InterviewState)
  .addNode("generateQuestions", interviewNode)
  .addNode("evaluateAnswer", feedbackNode)
  .addNode("generateSummary", summaryNode)
  .addConditionalEdges(START, routeInitialAction)
  .addEdge("generateQuestions", END)
  .addConditionalEdges("evaluateAnswer", routeAfterFeedback)
  .addEdge("generateSummary", END)
  .compile();

export default graph;


