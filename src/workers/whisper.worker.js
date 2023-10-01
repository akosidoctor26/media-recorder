// import { pipeline } from '@xenova/transformers';

// const TASK = 'automatic-speech-recognition';
// const MODEL = 'openai/whisper-tiny';

// class PipelineFactory {
//   static instance = null;

//   static async getInstance(progress_callback = null) {
//     if (this.instance === null) {
//       this.instance = pipeline(TASK, MODEL, {});
//     }
//   }
// }

onmessage = (event) => {
  console.log(event);
};
