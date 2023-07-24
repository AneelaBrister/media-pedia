import { Injectable } from '@angular/core';
import { PromptTemplate } from 'langchain';
import { OpenAI } from "langchain/llms/openai";
import { Observable, from } from 'rxjs';

const llm = new OpenAI({
  openAIApiKey: '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',
  temperature: 0,
  modelName: 'text-davinci-003'     // 'text-ada-001'
});

// const objectivityTemplate = PromptTemplate('How objectively written is the following text? {text}'); 

@Injectable({
  providedIn: 'root'
})
export class OpenAiService {

  constructor() { }

  doAPrompt(text: string): Observable<string> {
    let prmpt = 'How objectively is the following text written? ' + text;
    console.log('asking AI:', prmpt)
    return from(llm.predict(prmpt));
  }

}
