import { Injectable } from '@angular/core';
import { OpenAI } from "langchain/llms/openai";

const llm = new OpenAI({
  openAIApiKey: "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",
  temperature: 0
});

@Injectable({
  providedIn: 'root'
})
export class OpenAiService {

  constructor() { }
}
