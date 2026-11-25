/* =============================================================================
   SPOKEN ENGLISH MASTERCLASS
   Onboarding (name, degree, experience, details) -> 5 chapters of short lessons
   and exercises. Progress is kept in sessionStorage, so it lasts for this
   browser tab's session and clears when the tab is closed.
   ============================================================================= */
(function () {
  'use strict';

  /* ---------- session store ---------- */
  const KEY = 'tiSpokenEnglish.v1';
  let memoryCopy = null;
  function load() {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* storage blocked: fall back to memory */ }
    return memoryCopy;
  }
  function save() {
    memoryCopy = state;
    try { sessionStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }
  function blank(profile) {
    return { profile: profile || null, read: {}, ex: {}, chapter: 0, startedAt: Date.now() };
  }
  let state = load();
  if (!state || typeof state !== 'object' || !state.read || !state.ex) state = blank();

  /* ---------- helpers ---------- */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const val = v => (typeof v === 'function' ? v() : v);
  const NOW_YEAR = new Date().getFullYear();
  const fmt = sec => Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');
  function fmtLong(ms) {
    const s = Math.floor(ms / 1000), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
    return h ? h + ':' + String(m).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0') : fmt(s);
  }
  const norm = s => String(s || '').toLowerCase().replace(/[‘’]/g, "'").replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim();

  const DEGREES = {
    'B Tech': { phrase: 'a B Tech degree', grad: 'a B Tech graduate' },
    'M Tech': { phrase: 'an M Tech degree', grad: 'an M Tech graduate' },
    'BSc Computer Science': { phrase: 'a BSc in Computer Science', grad: 'a BSc Computer Science graduate' },
    'BCA': { phrase: 'a BCA degree', grad: 'a BCA graduate' },
    'MCA': { phrase: 'an MCA degree', grad: 'an MCA graduate' },
    'Non-STEM Degree': { phrase: 'a non-STEM degree', grad: 'a graduate' }
  };

  /* Profile values, HTML-escaped, ready to drop into lesson and model text */
  function me() {
    const p = state.profile || {};
    const skills = String(p.skills || '').split(/[,;\n]+|\s+and\s+/i).map(s => s.trim()).filter(Boolean).slice(0, 3);
    const list = skills.length > 1 ? skills.slice(0, -1).join(', ') + ' and ' + skills[skills.length - 1] : (skills[0] || 'programming');
    const d = DEGREES[p.degree] || { phrase: 'my degree', grad: 'a graduate' };
    const year = parseInt(p.year, 10) || NOW_YEAR;
    return {
      name: esc(p.name || 'there'),
      exp: p.exp === 'yes',
      company: esc(p.company || 'my last company'),
      deg: d.phrase,
      grad: d.grad,
      year: year,
      studying: year > NOW_YEAR,
      skills: esc(list),
      top: esc(skills[0] || 'programming'),
      nonStem: p.degree === 'Non-STEM Degree'
    };
  }

  function introModel() {
    const m = me();
    if (m.exp) {
      return [[null, `Good morning. My name is ${m.name}. I have ${m.deg}. My last company was ${m.company}. There, I learned to work in a team and finish my work on time. Now I am looking for a new job where I can learn more and do good work. Thank you.`]];
    }
    const edu = m.studying ? `I am studying for ${m.deg}. I will finish in ${m.year}.` : `I finished ${m.deg} in ${m.year}.`;
    return [[null, `Good morning. My name is ${m.name}. ${edu} I know ${m.skills}. I learn by doing small projects, and I learn new things quickly. I am looking for my first job, where I can work hard and grow. Thank you.`]];
  }

  /* ---------- lesson building blocks ---------- */
  const cmp = (weak, strong) =>
    `<div class="pa-compare"><div class="pa-weak"><b><span class="msr">close</span>Don't say</b>${weak}</div>` +
    `<span class="msr" aria-hidden="true">arrow_forward</span>` +
    `<div class="pa-strong"><b><span class="msr">check</span>Say this</b>${strong}</div></div>`;
  const tip = text => `<div class="pa-tip teal"><span class="msr">person</span><div>${text}</div></div>`;

  /* ---------- course content (simple, beginner-level Indian English) ---------- */
  const CHAPTERS = [
    {
      id: 'speaking-with-confidence',
      icon: 'self_improvement',
      title: 'Speaking with Confidence',
      intro: 'You do not need perfect English. You need clear English, spoken calmly.',
      lessons: [
        { id: 'c1l1', title: 'Anyone can learn confidence', html: `<p>No one is born a good speaker. You become confident by speaking again and again.</p><p>Speak English for five minutes every day. Talk to a friend, or talk to the mirror.</p>` },
        { id: 'c1l2', title: 'Speak slowly', html: `<p>When we are nervous, we speak fast. Then people cannot follow us.</p><p>Speak slowly, like a news reader on TV. Before you answer, take one deep breath. A small pause is okay.</p>` },
        { id: 'c1l3', title: 'Body language', html: `<p>Sit straight. Keep your shoulders relaxed. Smile when you say hello.</p><p>Look at the person's eyes for a few seconds. In an online interview, look at the camera, not at the screen.</p>` },
        { id: 'c1l4', title: 'Stop saying "basically"', html: `<p>Words like "um", "basically", "actually" and "you know" are called fillers. Too many fillers make you sound unsure.</p><p>When you feel like saying a filler, just stop for one second instead.</p>` + cmp('"Basically, I am, you know, actually a Java developer."', '"I am a Java developer."') },
        { id: 'c1l5', title: 'Practise your first lines', html: () => `<p>We feel most nervous at the start. So learn your first two or three lines very well.</p><p>When the start goes well, the rest becomes easy.</p>` + tip(`${me().name}, Exercise 5 below has a short introduction made from your details. Practise it many times.`) }
      ],
      exercises: [
        { id: 'c1e1', type: 'mcq', q: 'The interviewer asks a question. You need a few seconds to think. What is the best thing to say?', options: ['"Umm… basically… actually…"', 'Start talking fast without thinking.', '"Good question. Let me think for a moment."', '"Sorry, I don\'t know anything."'], answer: 2, explain: 'This gives you time to think, and you sound calm. "Umm" and talking fast show that you are nervous.' },
        { id: 'c1e2', type: 'mcq', q: 'How fast should you speak in an interview?', options: ['Very slowly, one word at a time', 'At a steady speed, like a news reader', 'Very fast', 'As fast as possible, to show good English'], answer: 1, explain: 'A steady speed is easy to follow. When you speak too fast, people miss your points.' },
        { id: 'c1e3', type: 'mcq', q: 'In an online interview, where should you look when you say something important?', options: ['At your own video', 'At your notes', 'At the interviewer on the screen', 'At the camera'], answer: 3, explain: 'When you look at the camera, the interviewer feels you are looking at them.' },
        { id: 'c1e4', type: 'fill', q: 'Remove the fillers. Type the correct sentence:', quote: '"Basically, I am, you know, a quick learner."', accept: ['i am a quick learner'], show: 'I am a quick learner.', hint: 'Remove "basically" and "you know". Keep the other words.' },
        { id: 'c1e5', type: 'speak', title: 'Introduce yourself in 1 minute', q: 'Read the example once. Then close it and say your introduction in your own words.', seconds: 60, model: introModel, checks: ['I did not say "um" or "basically"', 'I spoke slowly and clearly', 'I looked up (at the mirror or camera) 3 times'] },
        {
          id: 'c1e6', type: 'speak', title: 'Talk for 1 minute', seconds: 60,
          q: () => { const m = me(); return m.exp ? `Talk for 1 minute about a normal day at your office in ${m.company}. Stop for one second between ideas.` : `Talk for 1 minute about why you like ${m.top}. Stop for one second between ideas.`; },
          model: () => {
            const m = me();
            return m.exp
              ? [[null, `On a normal day at ${m.company}, I first checked my emails and my tasks. Then we had a short team meeting. After that, I did my main work. If I had a problem, I asked my team for help. At the end of the day, I updated my work status.`]]
              : [[null, `I like ${m.top} because I can see the result of my work quickly. When my code works, I feel very happy. When I get an error, I find the problem and fix it. That is why I want to learn more about it.`]];
          },
          checks: ['I stopped between ideas', 'I used fillers less than 2 times', 'My last sentence was clear']
        }
      ]
    },
    {
      id: 'grammar-basics',
      icon: 'spellcheck',
      title: 'Basics: Getting Your Grammar Right',
      intro: 'A few simple rules fix most mistakes. Learn these, and you will sound clear.',
      lessons: [
        { id: 'c2l1', title: 'Present tense: what you do every day', html: `<p>Use present tense for facts and daily habits: "I live in Pune." "I like coding."</p><p>With he, she and it, add "s" or "es": "She works in testing." "He goes to office by metro."</p>` },
        { id: 'c2l2', title: 'Talking about your experience', html: `<p>Use "have" + the third form of the verb (V3): "I have worked with Python for two years." "I have learned SQL."</p>` + cmp('"I am having two years experience."', '"I have two years of experience."') + `<p>Do not say "experiences". Say "two years of experience".</p>` },
        { id: 'c2l3', title: 'Past tense: things that are finished', html: `<p>When you say a year or "last month", use past tense: "I completed my BCA in 2024." "I joined the company in 2022."</p>` + cmp('"I have completed my degree in 2024."', '"I completed my degree in 2024."') },
        { id: 'c2l4', title: 'A or an?', html: () => `<p>Listen to the first sound, not the first letter. Use "an" before a vowel sound (a, e, i, o, u). Use "a" before other sounds.</p><p>"a B Tech graduate" (sounds like "bee"), "an MCA graduate" (sounds like "em"), "an hour", "a university".</p>` + tip(`For you, ${me().name}: "I am ${me().grad}."`) },
        {
          id: 'c2l5', title: 'Common mistakes',
          html: `<p>We hear these sentences a lot in Indian offices. But they are not correct English. Use the right side.</p>` +
            `<div class="pa-table-wrap"><table class="pa-table"><thead><tr><th>Wrong</th><th>Correct</th></tr></thead><tbody>` +
            [['Myself Ravi.', 'I am Ravi. / My name is Ravi.'], ['Let us discuss about it.', 'Let us discuss it.'], ['Please revert back.', 'Please reply.'], ['I will cope up with it.', 'I will cope with it.'], ['Do the needful.', 'Please send the form by Friday. (Say clearly what you need.)'], ['The meeting is preponed.', 'The meeting is moved to an earlier time.'], ['I have a doubt.', 'I have a question.']]
              .map(r => `<tr><td>${r[0]}</td><td><b>${r[1]}</b></td></tr>`).join('') +
            `</tbody></table></div>`
        }
      ],
      exercises: [
        { id: 'c2e1', type: 'mcq', q: 'Which sentence is correct?', options: ['I am having three years of experience in testing.', 'I have three years experiences in testing.', 'I have three years of experience in testing.', 'I am have three years experience in testing.'], answer: 2, explain: 'Say "I have", not "I am having". And say "experience", not "experiences".' },
        { id: 'c2e2', type: 'fill', q: 'Write the past tense of "complete":', quote: '"I ___ my BCA in 2024."', accept: ['completed'], hint: 'The year 2024 is over, so use past tense. Add "d" at the end.' },
        { id: 'c2e3', type: 'mcq', q: 'Fill the gap: "She is ___ MCA graduate."', options: ['a', 'an', 'the', 'no word needed'], answer: 1, explain: 'MCA starts with the sound "em". That is a vowel sound, so we use "an".' },
        { id: 'c2e4', type: 'fill', q: 'Write the correct form of "go":', quote: '"He ___ to office by metro every day."', accept: ['goes'], hint: 'With he, she and it, add "s" or "es".' },
        { id: 'c2e5', type: 'mcq', q: 'What is the best way to start your introduction?', options: ['"Myself Priya, from Hyderabad."', '"Me Priya, Hyderabad."', '"Myself is Priya from Hyderabad."', '"I am Priya, and I am from Hyderabad."'], answer: 3, explain: 'Do not start with "Myself". Say "I am…" or "My name is…".' },
        { id: 'c2e6', type: 'mcq', q: 'Which sentence is correct?', options: ['"Let us discuss the issue."', '"Let us discuss about the issue."', '"Let us discussing the issue."', '"Let us discussion the issue."'], answer: 0, explain: '"Discuss" already means "talk about". So do not add "about" again.' },
        {
          id: 'c2e7', type: 'speak', title: 'Three sentences, three tenses', seconds: 45,
          q: 'Say one sentence about yourself in each tense. Say each sentence two times, slowly.',
          model: () => {
            const m = me();
            if (m.exp) {
              return [['Present tense:', 'I like solving problems with my team.'], ['Have + V3:', `I have worked at ${m.company}, and I have learned a lot there.`], ['Past tense:', `I joined ${m.company} after I finished ${m.deg}.`]];
            }
            return [['Present tense:', `I like working with ${m.top}.`], ['Have + V3:', `I have learned ${m.skills}.`], m.studying ? ['Past tense:', `I chose ${m.deg} because I like technology.`] : ['Past tense:', `I completed ${m.deg} in ${m.year}.`]];
          },
          checks: ['I used "have" + V3 for my experience', 'I used past tense with a year', 'I used "a" or "an" correctly']
        }
      ]
    },
    {
      id: 'how-to-talk',
      icon: 'forum',
      title: 'How to Talk',
      intro: 'Good speakers are easy to understand. Give the answer first, use short sentences, and be polite.',
      lessons: [
        { id: 'c3l1', title: 'Give the answer first', html: `<p>Say your answer first. Then give the details. Do not make people wait for the main point.</p>` + cmp('"Yesterday I was checking, then the server… then finally, yes, it is done."', '"Yes, it is done. The server had a small problem, and I fixed it."') },
        { id: 'c3l2', title: 'Use short sentences', html: `<p>Do not join many ideas with "and… and… so…". People get lost.</p><p>Say one idea in one sentence. Short sentences also have fewer grammar mistakes.</p>` },
        { id: 'c3l3', title: 'PREP: an easy plan for answers', html: `<p><b>P</b>oint: give your answer. <b>R</b>eason: say why. <b>E</b>xample: give one real example. <b>P</b>oint: say your answer again in one line.</p><p>Use PREP for "why" questions and when you give your opinion.</p>` },
        { id: 'c3l4', title: 'Be polite', html: `<p>Use "please", "could you" and "would you" when you ask for something. Old office words like "do the needful" sound rude or unclear.</p>` + cmp('"Do the needful and revert."', '"Could you please check the file and reply by 4 PM?"') },
        { id: 'c3l5', title: 'Clear words, not a foreign accent', html: `<p>You do not need a British or American accent. Open your mouth well when you speak.</p><p>Say the end of each word clearly: "worked", not "work". Interviewers want clear speech, not an accent.</p>` }
      ],
      exercises: [
        { id: 'c3e1', type: 'mcq', q: 'Your manager asks, "Is the report ready?" Which answer is best?', options: ['"Actually, yesterday I started, then the data came late, so…"', '"I think so, maybe, let me see."', '"Yes, it is ready. I have sent it to your email."', '"Why are you asking?"'], answer: 2, explain: 'It says "yes" first. Then it gives one useful detail.' },
        { id: 'c3e2', type: 'mcq', q: 'What is the most polite way to ask a colleague for help?', options: ['"Could you please help me with this error when you are free?"', '"Do the needful."', '"Help me with this error."', '"You check this error."'], answer: 0, explain: '"Could you please" is polite. "When you are free" shows you respect their time.' },
        { id: 'c3e3', type: 'fill', q: 'Make it polite. Add one word:', quote: '"___ you please share the file?"', accept: ['could', 'would', 'can'], show: 'Could', hint: 'Use a word like "could" or "would".' },
        { id: 'c3e4', type: 'mcq', q: 'What does PREP mean?', options: ['Prepare, Rehearse, Explain, Present', 'Pause, Repeat, Explain, Pause', 'Problem, Result, Effort, Plan', 'Point, Reason, Example, Point'], answer: 3, explain: 'Point, Reason, Example, Point. Give the answer, say why, give an example, then say the answer again.' },
        {
          id: 'c3e5', type: 'speak', title: 'Answer using PREP', seconds: 60,
          q: () => `Answer using Point, Reason, Example, Point: <b>"${me().nonStem ? 'Why do you want to move to IT?' : 'Why do you want to work in IT?'}"</b>`,
          model: () => {
            const m = me();
            const ex = m.exp
              ? `For example, at ${m.company}, I liked finding problems and fixing them with my team.`
              : `For example, when I learned ${m.top}, I made a small project and fixed many errors to make it work.`;
            return [['Point:', 'I want to work in IT because I like solving problems.'], ['Reason:', 'In IT, I can see the result of my work quickly, and I can learn new things every day.'], ['Example:', ex], ['Point:', 'That is why I want to build my career in IT.']];
          },
          checks: ['My first sentence answered the question', 'I gave one real example', 'At the end, I said my answer again']
        },
        {
          id: 'c3e6', type: 'speak', title: 'Explain in 3 sentences', seconds: 45,
          q: () => { const m = me(); return m.exp ? `Explain your work at ${m.company} in 3 short sentences.` : `Explain one project you did with ${m.top} in 3 short sentences.`; },
          model: () => {
            const m = me();
            return m.exp
              ? [[null, `At ${m.company}, I worked in a team that made software for clients. I did my tasks from start to end and tested my work. I also helped new team members learn our work.`]]
              : [[null, `I made a small attendance app using ${m.top}. A teacher can mark attendance and see a monthly report. From this project, I learned how to plan my work and fix errors.`]];
          },
          checks: ['I used only 3 sentences', 'Each sentence had one idea', 'I said the end of each word clearly']
        }
      ]
    },
    {
      id: 'how-to-listen',
      icon: 'hearing',
      title: 'How to Listen',
      intro: 'Listening is half of talking. When you listen well, you give the right answer.',
      lessons: [
        { id: 'c4l1', title: 'Listen fully first', html: `<p>Many people stop listening in the middle. They start thinking about their answer.</p><p>Let the other person finish. Then answer. Your answer will be better.</p>` },
        { id: 'c4l2', title: 'Show that you are listening', html: `<p>Nod your head and look at the person. Say small words like "I see", "Okay" or "Right".</p><p>On a phone call, these small words tell the person you are still there.</p>` },
        { id: 'c4l3', title: 'Do not guess. Ask.', html: `<p>If you did not hear or understand, ask again. This is normal and polite.</p>` + cmp('Guessing the question and giving a wrong answer.', '"Sorry, could you please repeat that?"') },
        { id: 'c4l4', title: 'Repeat to check', html: `<p>Say the main points again in your own words: "So, you need the test cases by Thursday, right?"</p><p>This way, any mistake is caught early.</p>` },
        { id: 'c4l5', title: 'Note names, numbers and dates', html: `<p>Most mistakes happen with small details. Write down names, numbers, times and dates when you hear them.</p><p>At the end, read them back to check.</p>` }
      ],
      exercises: [
        { id: 'c4e1', type: 'mcq', audio: 'Hello, this is Meera from HR. Your technical interview is on Thursday at 11:30 AM on Google Meet. Please keep your resume and a photo ID ready.', q: 'Play the message. Then answer: when is the interview?', options: ['Tuesday at 11:30 AM', 'Thursday at 1:30 PM', 'Thursday at 11:30 AM', 'Friday at 11:30 AM'], answer: 2, explain: 'Meera said Thursday at 11:30 AM. Always write down days and times.' },
        { id: 'c4e2', type: 'fill', audio: 'Hi, it is Arjun. Please send the final report to Kavya by 4 PM today, and copy me on the email.', q: 'Play the message. Who should get the final report?', accept: ['kavya'], show: 'Kavya', hint: 'Listen to the name after "send the final report to".' },
        { id: 'c4e3', type: 'mcq', q: 'You did not understand the interviewer\'s question. What should you say?', options: ['"What?"', '"Sorry, could you please repeat the question?"', 'Nothing. Answer what you think they asked.', '"Your question is not clear."'], answer: 1, explain: 'Asking again politely is normal. If you guess, you may answer the wrong question.' },
        { id: 'c4e4', type: 'mcq', q: 'Which answer repeats the details to check them?', options: ['"Okay, fine."', '"I will try."', '"Yes, yes, I know."', '"So you need the login test cases by Thursday, right?"'], answer: 3, explain: 'It repeats the work and the day. So if there is a mistake, it comes out now.' },
        { id: 'c4e5', type: 'mcq', q: 'When the interviewer is still talking, you should:', options: ['Listen fully, note the main words, then answer', 'Stop them and show what you know', 'Think about your answer and stop listening', 'Look at your notes until they finish'], answer: 0, explain: 'When you hear the full question, you can give the right answer.' },
        { id: 'c4e6', type: 'speak', audio: 'We have moved the team meeting from Monday to Tuesday at 3 PM. Please bring your weekly status report.', title: 'Repeat in your own words', q: 'Play the message. Then say it again in your own words. Start with "So, if I understood correctly…"', seconds: 30, model: [[null, 'So, if I understood correctly, the team meeting is now on Tuesday at 3 PM, not Monday. And I should bring my weekly status report.']], checks: ['I started with "So, if I understood correctly"', 'I said the new day and time', 'I said what to bring'] }
      ]
    },
    {
      id: 'how-to-answer-back',
      icon: 'reply',
      title: 'How to Answer Back',
      intro: 'A good answer is direct, honest and has a clear ending. Learn how to answer questions and feedback.',
      lessons: [
        { id: 'c5l1', title: 'Answer the question they asked', html: `<p>Listen for the question word: why, how, when or what. Answer it in your first sentence. Then add details.</p><p>If they ask "why", start with the reason, not a long story.</p>` },
        { id: 'c5l2', title: 'Tell a story with STAR', html: `<p>For "Tell me about a time when…" questions, use STAR.</p><p><b>S</b>ituation: where were you? <b>T</b>ask: what was the work? <b>A</b>ction: what did <em>you</em> do? <b>R</b>esult: what happened in the end? Use a number if you can.</p>` },
        { id: 'c5l3', title: 'If you do not know, say so', html: `<p>Never pretend. Say what you know, and say how you will learn the rest.</p>` + cmp('"Yes, I know Kubernetes very well." (when you do not)', '"I have not used Kubernetes yet. I know it is used to run containers. I will learn it from the official tutorial."') },
        { id: 'c5l4', title: 'Feedback and different opinions', html: `<p>When someone gives you feedback, first say "Thank you". Then reply.</p><p>If you do not agree, be polite: "I understand your point. But I also feel that…"</p>` },
        { id: 'c5l5', title: 'End your answer clearly', html: `<p>Finish with one clear last line. Then stop talking.</p><p>Do not end with "so yeah, that's it". It makes a good answer weak.</p>` + cmp('"…so yeah, that is it, I guess."', '"…and that is how we made the page load 40 percent faster."') }
      ],
      exercises: [
        { id: 'c5e1', type: 'mcq', q: 'What does STAR mean?', options: ['Situation, Task, Action, Result', 'Start, Talk, Answer, Repeat', 'Skill, Task, Ability, Role', 'Story, Time, Action, Reason'], answer: 0, explain: 'Situation, Task, Action, Result. Talk most about what you did, and end with the result.' },
        { id: 'c5e2', type: 'mcq', q: 'They ask about a tool you have never used. What is the best answer?', options: ['"Yes, I am an expert in it."', '"No." Then stay quiet.', '"I have not used it yet. But I know what it is for, and I will learn it."', 'Start talking about some other topic.'], answer: 2, explain: 'Being honest and ready to learn is good. If you pretend, the next question will catch you.' },
        { id: 'c5e3', type: 'mcq', q: 'The interviewer says, "Your answers are a bit long." What should you do?', options: ['Say "No, they are not long."', 'Stay quiet for the rest of the interview.', 'Say "Everyone tells me that."', 'Say "Thank you, I will keep them short," and give shorter answers.'], answer: 3, explain: 'Say thank you and change at once. This shows you can take feedback.' },
        { id: 'c5e4', type: 'mcq', q: 'Which is the best way to end an answer?', options: ['"…so yeah, that is it, I guess."', '"…and that is how I made the page load 40 percent faster."', '"…and many more things like that."', '"…anyway, whatever."'], answer: 1, explain: 'A clear result is a strong ending. Then stop talking.' },
        { id: 'c5e5', type: 'mcq', q: 'They ask, "Why should we hire you?" What should your first sentence do?', options: ['Give your main reason directly', 'Tell your full life story from school', 'Ask about the salary', 'Say that you really need this job'], answer: 0, explain: 'Start with your best reason. Then give one example.' },
        {
          id: 'c5e6', type: 'speak', seconds: 90,
          title: () => (me().exp ? 'Why do you want to change your job?' : 'Tell me about a project you did'),
          q: () => {
            const m = me();
            return m.exp
              ? `Answer this interview question: <b>"Why do you want to leave ${m.company}?"</b> Say only good things about your old company.`
              : `Answer this interview question using STAR: <b>"Tell me about a project you did."</b>`;
          },
          model: () => {
            const m = me();
            if (m.exp) {
              return [[null, `I learned a lot at ${m.company}, like teamwork and finishing work on time. Now I want bigger challenges, where I can use what I learned and grow more. I am changing for growth, and I am thankful to ${m.company}.`]];
            }
            return [['Situation:', `${m.studying ? 'During my course' : 'In my final year'}, I wanted to make a real project using ${m.top}.`], ['Task:', 'I decided to make a simple attendance app for my class.'], ['Action:', 'I planned the screens, wrote the code step by step and tested it with my friends.'], ['Result:', 'The app worked well. Three classmates used it for a month, and I learned how to find and fix errors quickly.']];
          },
          checks: () => (me().exp
            ? ['I said only good things about my old company', 'My first sentence answered "why"', 'My last line was clear']
            : ['I covered all 4 parts of STAR', 'I said "I", not only "we"', 'I ended with the result'])
        },
        { id: 'c5e7', type: 'speak', title: 'Reply to feedback', seconds: 45, q: 'The interviewer says: <b>"Your answer was too general."</b> Reply: first say thank you, then give one clear example.', model: [[null, 'Thank you for telling me. Let me give a clear example. In my last project, one page was very slow. I found the problem in the database query and fixed it. After that, the page opened in two seconds instead of six.']], checks: ['I said thank you first', 'I stayed calm and did not argue', 'I gave a clear example with a number'] }
      ]
    }
  ];

  const EX_INDEX = {};
  CHAPTERS.forEach((c, ci) => c.exercises.forEach((x, i) => { EX_INDEX[x.id] = { x: x, i: i, ci: ci }; }));
  if (!(state.chapter >= 0 && state.chapter < CHAPTERS.length)) state.chapter = 0;

  /* ---------- progress maths ---------- */
  const rec = id => (state.ex[id] = state.ex[id] || {});
  function chapterStats(c) {
    const lr = c.lessons.filter(l => state.read[l.id]).length;
    const ed = c.exercises.filter(x => state.ex[x.id] && state.ex[x.id].done).length;
    const total = c.lessons.length + c.exercises.length;
    return { lr: lr, ed: ed, total: total, pct: Math.round(((lr + ed) / total) * 100) };
  }
  function totals() {
    let L = 0, Lr = 0, E = 0, Ed = 0, G = 0, Gc = 0;
    CHAPTERS.forEach(c => {
      L += c.lessons.length;
      Lr += c.lessons.filter(l => state.read[l.id]).length;
      c.exercises.forEach(x => {
        E++;
        const r = state.ex[x.id];
        if (r && r.done) {
          Ed++;
          if (x.type !== 'speak') { G++; if (r.correct) Gc++; }
        }
      });
    });
    return { L: L, Lr: Lr, E: E, Ed: Ed, G: G, Gc: Gc, pct: Math.round(((Lr + Ed) / (L + E)) * 100) };
  }

  /* ---------- text to speech engine ----------
     Text is spoken sentence by sentence (long utterances get cut off in Chrome), which also
     makes pause / resume reliable: pausing cancels speech and resume repeats the current sentence. */
  const synth = 'speechSynthesis' in window ? window.speechSynthesis : null;
  const tts = { token: 0, btn: null, paused: false, next: null };
  const RATES = [['0.8', 'Slow'], ['0.95', 'Normal'], ['1.15', 'Fast']];

  function setPlaying(btn, on) {
    if (!btn) return;
    btn.classList.toggle('is-playing', on);
    btn.setAttribute('aria-pressed', String(on));
    const icon = $('.msr', btn), lbl = $('.lbl', btn);
    if (icon) icon.textContent = on ? 'stop_circle' : (btn.dataset.icon || 'volume_up');
    if (lbl) lbl.textContent = on ? 'Stop' : (btn.dataset.label || 'Play');
  }
  function pickVoice() {
    const voices = synth.getVoices();
    return voices.find(o => /en[-_]IN/i.test(o.lang)) || voices.find(o => /^en[-_](GB|US)/i.test(o.lang)) || voices.find(o => /^en/i.test(o.lang));
  }
  function toChunks(text) {
    const out = [];
    String(text).split('\n').forEach(line => {
      (line.match(/[^.!?…]+[.!?…]+["”']?|[^.!?…]+$/g) || []).forEach(s => {
        s = s.trim();
        if (!s) return;
        if (out.length && out[out.length - 1].length + s.length < 60) out[out.length - 1] += ' ' + s;
        else out.push(s);
      });
    });
    return out;
  }
  function ttsStop() {
    tts.token++;
    tts.paused = false;
    tts.next = null;
    if (synth) synth.cancel();
    if (tts.btn) { setPlaying(tts.btn, false); tts.btn = null; }
  }
  /* Speak text; opts.btn shows a playing state on that button, opts.onend runs after the last sentence */
  function ttsSpeak(text, opts) {
    opts = opts || {};
    ttsStop();
    if (!synth) { if (opts.onend) setTimeout(opts.onend, 0); return; }
    const my = tts.token, chunks = toChunks(text);
    let i = 0;
    if (opts.btn) { tts.btn = opts.btn; setPlaying(opts.btn, true); }
    const next = () => {
      if (my !== tts.token || tts.paused) return;
      if (i >= chunks.length) {
        if (opts.btn && tts.btn === opts.btn) { setPlaying(opts.btn, false); tts.btn = null; }
        tts.next = null;
        if (opts.onend) opts.onend();
        return;
      }
      const u = new SpeechSynthesisUtterance(chunks[i]);
      const v = pickVoice();
      if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = 'en-IN'; }
      u.rate = parseFloat(state.rate) || 0.95;
      const done = () => { if (my !== tts.token || tts.paused) return; i++; next(); };
      u.onend = done;
      u.onerror = e => { if (e && (e.error === 'interrupted' || e.error === 'canceled')) return; done(); };
      synth.speak(u);
    };
    tts.next = next;
    setTimeout(next, 60); // Chrome can drop an utterance queued in the same tick as cancel()
  }
  function ttsPause() { if (!tts.next) return; tts.paused = true; synth.cancel(); }
  function ttsResume() { if (!tts.paused) return; tts.paused = false; if (tts.next) tts.next(); }
  if (synth && synth.onvoiceschanged !== undefined) synth.onvoiceschanged = () => synth.getVoices();

  /* Readable text of a block of HTML: skips icons and buttons, keeps block breaks as sentence pauses */
  const BLOCK = new Set(['P', 'DIV', 'H2', 'H3', 'H4', 'TR', 'LI', 'BLOCKQUOTE', 'TABLE', 'THEAD', 'TBODY']);
  function speechOf(root) {
    let s = '';
    (function walk(n) {
      n.childNodes.forEach(c => {
        if (c.nodeType === 3) { s += c.nodeValue; return; }
        if (c.nodeType !== 1 || c.matches('.msr, button, select, input, textarea, .se-lesson-actions')) return;
        const block = BLOCK.has(c.tagName) || (c.tagName === 'B' && c.parentElement.matches('.pa-weak, .pa-strong'));
        if (block) s += '\n';
        walk(c);
        if (c.tagName === 'TD' || c.tagName === 'TH') s += ', ';
        if (block) s += '\n';
      });
    })(root);
    return s.split('\n')
      .map(l => l.replace(/\s+/g, ' ').replace(/_{2,}/g, ' blank ').replace(/\s\/\s/g, ' or ').replace(/[,\s]+$/, '').trim())
      .filter(Boolean)
      .map(l => (/[.!?:…"”']$/.test(l) ? l : l + '.'))
      .join('\n');
  }
  function plain(html) { const d = document.createElement('div'); d.innerHTML = html; return speechOf(d); }

  function lessonSpeech(id) {
    const body = $(`#${id} .se-lesson-body`);
    return body ? speechOf(body) : '';
  }
  function exSpeech(x, i) {
    const parts = [`Exercise ${i + 1}.`];
    if (x.title) parts.push(plain(`<p>${val(x.title)}</p>`));
    parts.push(plain(`<p>${val(x.q)}</p>`));
    if (x.quote) parts.push(plain(`<p>${x.quote}</p>`));
    if (x.type === 'mcq') {
      x.options.forEach((o, k) => parts.push(`Option ${'ABCD'[k]}: ${plain(`<p>${o}</p>`)}`));
      parts.push('Choose your answer.');
    } else if (x.type === 'fill') {
      parts.push(x.audio ? 'Play the message. Type your answer and press Check.' : 'Type your answer and press Check.');
    } else {
      parts.push('Press Start timer and speak. When you finish, tick the boxes and press Mark as practised.');
    }
    return parts.join('\n');
  }

  /* ---------- guided lesson: reads the chapter aloud, waits at each exercise ---------- */
  const guide = { on: false, steps: [], idx: 0, waitId: null, cur: null };

  function buildSteps() {
    const ci = state.chapter, c = CHAPTERS[ci], steps = [];
    steps.push({ type: 'say', target: c.id, label: 'Chapter introduction', text: `Chapter ${ci + 1}. ${c.title}.\n${c.intro}` });
    c.lessons.forEach((l, i) => steps.push({ type: 'lesson', target: l.id, label: `Lesson ${i + 1} of ${c.lessons.length}` }));
    steps.push({ type: 'say', target: 'seExH', label: 'Exercises', text: `Now let us practise. This chapter has ${c.exercises.length} exercises.` });
    c.exercises.forEach((x, i) => steps.push({ type: 'ex', target: 'ex-' + x.id, id: x.id, i: i, label: `Exercise ${i + 1} of ${c.exercises.length}` }));
    steps.push({ type: 'say', target: c.id, label: 'Finished', text: CHAPTERS[ci + 1] ? 'This chapter is finished. Press Next chapter when you are ready.' : 'This was the last chapter. Well done, you finished the course!' });
    return steps;
  }

  function markSpeaking() {
    $$('.is-speaking').forEach(el => el.classList.remove('is-speaking'));
    if (!guide.on || !guide.cur) return;
    const el = document.getElementById(guide.cur);
    if (!el) return;
    (el.closest('.se-lesson, .se-ex, .se-ch-head') || el).classList.add('is-speaking');
  }
  function scrollToCurrent() {
    const el = document.getElementById(guide.cur);
    if (!el) return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
  }

  function renderPlayer() {
    const p = $('#sePlayer');
    if (!p) return;
    const step = guide.steps[guide.idx];
    $('[data-g="start"]', p).hidden = guide.on;
    $('[data-g="start"] .lbl', p).textContent = guide.idx > 0 && !guide.on ? 'Start lesson again' : 'Start lesson';
    ['pause', 'skip', 'stop'].forEach(k => { $(`[data-g="${k}"]`, p).hidden = !guide.on; });
    const pause = $('[data-g="pause"]', p);
    pause.disabled = !!guide.waitId;
    pause.innerHTML = tts.paused ? '<span class="msr">play_arrow</span>Resume' : '<span class="msr">pause</span>Pause';
    $('[data-g="skip"]', p).innerHTML = guide.waitId ? '<span class="msr">skip_next</span>Skip exercise' : '<span class="msr">skip_next</span>Skip';
    const status = $('#sePlayerStatus', p);
    p.classList.toggle('is-on', guide.on);
    p.classList.toggle('is-waiting', !!guide.waitId);
    if (!synth) status.textContent = 'Your browser cannot read aloud. Try Chrome or Edge.';
    else if (!guide.on) status.textContent = 'Press Start lesson to hear this chapter, one part at a time.';
    else if (guide.waitId) status.textContent = `Your turn: answer ${step ? step.label.replace(/ of \d+$/, '') : 'the exercise'}`;
    else status.textContent = (tts.paused ? 'Paused: ' : 'Reading: ') + (step ? step.label : '');
  }

  function guideStart() {
    if (!synth) return;
    stopTimer(false);
    guide.on = true;
    guide.steps = buildSteps();
    guide.idx = 0;
    guide.waitId = null;
    runStep();
  }
  function guideStop() {
    if (!guide.on) return;
    guide.on = false;
    guide.waitId = null;
    guide.cur = null;
    ttsStop();
    markSpeaking();
    renderPlayer();
  }
  function guideAdvance() {
    if (!guide.on) return;
    guide.waitId = null;
    guide.idx++;
    setTimeout(runStep, 450);
  }
  function runStep() {
    if (!guide.on) return;
    const st = guide.steps[guide.idx];
    if (!st) { guideStop(); return; }
    guide.cur = st.target;
    markSpeaking();
    scrollToCurrent();
    renderPlayer();
    if (st.type === 'say') {
      ttsSpeak(st.text, { onend: guideAdvance });
    } else if (st.type === 'lesson') {
      ttsSpeak(lessonSpeech(st.target), {
        onend: () => {
          if (!state.read[st.target]) { state.read[st.target] = true; save(); refreshLesson(st.target); updateProgress(); }
          guideAdvance();
        }
      });
    } else if (st.type === 'ex') {
      const x = EX_INDEX[st.id].x, r = state.ex[st.id] || {};
      if (r.done) {
        ttsSpeak(exSpeech(x, st.i) + '\nYou have already completed this one.', { onend: guideAdvance });
        return;
      }
      const wait = () => { if (!guide.on) return; guide.waitId = st.id; renderPlayer(); };
      ttsSpeak(exSpeech(x, st.i), {
        onend: () => {
          if (x.audio) ttsSpeak('Here is the message.\n' + x.audio, { onend: wait });
          else wait();
        }
      });
    }
  }
  /* Called after an exercise interaction, so the guide can react and move on */
  function guideFeedback(id, text, finished) {
    if (!guide.on || guide.waitId !== id) return;
    if (finished) { guide.waitId = null; renderPlayer(); ttsSpeak(text, { onend: guideAdvance }); }
    else ttsSpeak(text);
  }

  /* ---------- speaking timer (one at a time) ---------- */
  let timer = null;
  function timerButtonHtml(x, running) {
    return running
      ? `<span class="msr">stop_circle</span><span>Stop timer</span>`
      : `<span class="msr">timer</span><span>Start ${fmt(x.seconds)} timer</span>`;
  }
  function stopTimer(finished) {
    if (!timer) return;
    clearInterval(timer.iv);
    const t = timer;
    timer = null;
    const btn = $(`[data-act="timer"][data-id="${t.id}"]`);
    if (btn) btn.innerHTML = timerButtonHtml(EX_INDEX[t.id].x, false);
    const clk = document.getElementById('clk-' + t.id);
    if (clk) {
      clk.textContent = finished ? 'Time!' : fmt(EX_INDEX[t.id].x.seconds);
      clk.classList.remove('is-running');
      clk.classList.toggle('is-done', !!finished);
    }
  }
  function startTimer(id) {
    if (timer && timer.id === id) { stopTimer(false); return; }
    stopTimer(false);
    const x = EX_INDEX[id].x;
    timer = { id: id, end: Date.now() + x.seconds * 1000, iv: 0 };
    const btn = $(`[data-act="timer"][data-id="${id}"]`);
    if (btn) btn.innerHTML = timerButtonHtml(x, true);
    const tick = () => {
      if (!timer) return;
      const left = Math.max(0, Math.ceil((timer.end - Date.now()) / 1000));
      const clk = document.getElementById('clk-' + id);
      if (clk) { clk.textContent = fmt(left); clk.classList.add('is-running'); clk.classList.remove('is-done'); }
      if (left <= 0) stopTimer(true);
    };
    timer.iv = setInterval(tick, 250);
    tick();
  }

  /* ---------- rendering: chapter ---------- */
  const chapterEl = () => $('#seChapter');

  function renderLesson(l, i) {
    const done = !!state.read[l.id];
    const speaking = guide.on && guide.cur === l.id;
    return `<article class="se-lesson${done ? ' is-read' : ''}${speaking ? ' is-speaking' : ''}" id="${l.id}">
      <span class="se-lesson-num" aria-hidden="true">${done ? '<span class="msr">check</span>' : i + 1}</span>
      <div class="se-lesson-body">
        <h4>${l.title}</h4>
        ${val(l.html)}
        <div class="se-lesson-actions">
          ${synth ? `<button type="button" class="se-mini se-listen" data-act="listen" data-id="${l.id}" data-icon="volume_up" data-label="Listen" aria-pressed="false" aria-label="Listen to lesson: ${esc(plain('<p>' + l.title + '</p>'))}"><span class="msr">volume_up</span><span class="lbl">Listen</span></button>` : ''}
          <button type="button" class="se-mini${done ? ' is-on' : ''}" data-act="read" data-id="${l.id}" aria-pressed="${done}">
            <span class="msr">${done ? 'task_alt' : 'radio_button_unchecked'}</span>${done ? 'Read' : 'Mark as read'}
          </button>
        </div>
      </div>
    </article>`;
  }

  function audioHtml(x) {
    if (!x.audio) return '';
    return `<div class="se-audio">
      <button type="button" class="se-btn sm teal" data-act="play" data-id="${x.id}" data-icon="play_circle" data-label="Play message" ${synth ? '' : 'disabled'}>
        <span class="msr">play_circle</span><span class="lbl">Play message</span>
      </button>
      <details class="se-transcript"${synth ? '' : ' open'}><summary>Show the text</summary><p>${esc(x.audio)}</p></details>
      ${synth ? '' : '<p class="se-note">Your browser cannot play audio. Please read the text instead.</p>'}
    </div>`;
  }

  function modelHtml(x) {
    return val(x.model).map(line => `<p>${line[0] ? `<b>${line[0]}</b> ` : ''}${line[1]}</p>`).join('');
  }

  function renderEx(x, i) {
    const r = state.ex[x.id] || {};
    const badge = x.audio ? ['headphones', 'Listen'] : ({ mcq: ['quiz', 'Quiz'], fill: ['keyboard', 'Type the answer'], speak: ['record_voice_over', 'Speak aloud'] })[x.type];
    let status = '';
    if (r.done) {
      status = x.type === 'speak'
        ? '<span class="se-status ok"><span class="msr">task_alt</span>Practised</span>'
        : (r.correct ? '<span class="se-status ok"><span class="msr">verified</span>Correct first time</span>' : '<span class="se-status done"><span class="msr">check</span>Completed</span>');
    }
    const title = x.title ? `<h4>${val(x.title)}</h4>` : '';
    const quote = x.quote ? `<blockquote class="se-quote">${x.quote}</blockquote>` : '';
    let body = '';

    if (x.type === 'mcq') {
      const picked = typeof r.picked === 'number' ? r.picked : null;
      body = `<div class="se-opts" role="group" aria-label="Answer options">` + x.options.map((o, k) => {
        let cls = '';
        if (picked !== null) {
          if (k === picked && k === x.answer) cls = ' is-right';
          else if (k === picked) cls = ' is-wrong';
          else if (r.done && k === x.answer) cls = ' is-right';
        }
        return `<button type="button" class="se-opt${cls}" data-act="pick" data-id="${x.id}" data-k="${k}"${picked !== null ? ' disabled' : ''}><span class="se-opt-key">${'ABCD'[k]}</span><span>${o}</span></button>`;
      }).join('') + `</div>`;
      if (picked !== null) {
        body += picked === x.answer
          ? `<div class="se-fb ok" tabindex="-1"><span class="msr">check_circle</span><div><b>Correct.</b> ${x.explain || ''}</div></div>`
          : `<div class="se-fb bad" tabindex="-1"><span class="msr">cancel</span><div><b>Not correct.</b> Think again and try one more time.</div></div>
             <button type="button" class="se-btn sm ghost" data-act="retry" data-id="${x.id}"><span class="msr">replay</span>Try again</button>`;
      }
    } else if (x.type === 'fill') {
      const solved = !!r.done;
      body = `<form class="se-fill" data-id="${x.id}" autocomplete="off">
        <input type="text" class="se-input" name="answer" value="${esc(r.value || '')}" aria-label="Your answer" spellcheck="false"${solved ? ' readonly' : ''}>
        ${solved ? '' : '<button type="submit" class="se-btn sm"><span class="msr">check</span>Check</button>'}
      </form>`;
      const answer = esc(x.show || x.accept[0]);
      if (solved) {
        body += r.revealed
          ? `<div class="se-fb info" tabindex="-1"><span class="msr">info</span><div>The answer is <b>${answer}</b>. Say the full sentence out loud once.</div></div>`
          : `<div class="se-fb ok" tabindex="-1"><span class="msr">check_circle</span><div><b>Correct.</b> ${r.correct ? 'Right on the first try. Well done!' : 'Good, you got it.'}</div></div>`;
      } else if (r.attempts) {
        body += `<div class="se-fb bad" tabindex="-1"><span class="msr">lightbulb</span><div><b>Not correct.</b> ${x.hint || 'Try again.'}</div></div>
          <button type="button" class="se-btn sm ghost" data-act="reveal" data-id="${x.id}"><span class="msr">visibility</span>Show answer</button>`;
      }
    } else if (x.type === 'speak') {
      const checks = r.checks || [];
      const running = timer && timer.id === x.id;
      body = `<div class="se-speak">
        <div class="se-timer">
          <button type="button" class="se-btn sm ghost" data-act="timer" data-id="${x.id}">${timerButtonHtml(x, running)}</button>
          <span class="se-clock${running ? ' is-running' : ''}" id="clk-${x.id}" aria-live="off">${fmt(x.seconds)}</span>
        </div>
        <details class="se-model">
          <summary><span class="msr">lightbulb</span>Show an example answer</summary>
          <div class="se-model-text" id="mdl-${x.id}">${modelHtml(x)}</div>
          ${synth ? `<button type="button" class="se-btn sm teal" data-act="hear" data-id="${x.id}" data-icon="volume_up" data-label="Hear it"><span class="msr">volume_up</span><span class="lbl">Hear it</span></button>` : ''}
        </details>
        <fieldset class="se-checks">
          <legend>After speaking, tick what you did:</legend>
          <div class="pa-check">${val(x.checks).map((c, k) => `<label><input type="checkbox" data-act="check" data-id="${x.id}" data-k="${k}"${checks[k] ? ' checked' : ''}><span class="box"><span class="msr">check</span></span><span>${c}</span></label>`).join('')}</div>
        </fieldset>
        <button type="button" class="se-btn sm${r.done ? ' is-done' : ''}" data-act="practised" data-id="${x.id}" aria-pressed="${!!r.done}">
          <span class="msr">${r.done ? 'task_alt' : 'mic'}</span>${r.done ? 'Practised' : 'Mark as practised'}
        </button>
      </div>`;
    }

    const speaking = guide.on && guide.cur === 'ex-' + x.id;
    const readBtn = synth
      ? `<button type="button" class="se-mini se-listen se-read" data-act="readq" data-id="${x.id}" data-icon="volume_up" data-label="${x.type === 'mcq' ? 'Read question and options' : 'Read aloud'}" aria-pressed="false"><span class="msr">volume_up</span><span class="lbl">${x.type === 'mcq' ? 'Read question and options' : 'Read aloud'}</span></button>`
      : '';
    return `<article class="se-ex${r.done ? ' is-done' : ''}${speaking ? ' is-speaking' : ''}" id="ex-${x.id}">
      <div class="se-ex-head"><span class="se-badge t-${x.audio ? 'listen' : x.type}"><span class="msr">${badge[0]}</span>${badge[1]}</span><span class="se-ex-n">Exercise ${i + 1}</span>${status}${readBtn}</div>
      ${title}
      <p class="se-q">${val(x.q)}</p>
      ${quote}
      ${audioHtml(x)}
      ${body}
    </article>`;
  }

  function renderChapter() {
    const i = state.chapter, c = CHAPTERS[i], s = chapterStats(c);
    const prev = CHAPTERS[i - 1], next = CHAPTERS[i + 1];
    chapterEl().innerHTML = `
      <header class="se-ch-head" id="${c.id}">
        <span class="se-ch-icon" aria-hidden="true"><span class="msr">${c.icon}</span></span>
        <div class="se-ch-titles">
          <span class="se-ch-kicker">Chapter ${i + 1} of ${CHAPTERS.length}</span>
          <h2 tabindex="-1">${c.title}</h2>
          <p>${c.intro}</p>
        </div>
        <div class="se-ch-progress">
          <span id="seChCount">${s.lr + s.ed} of ${s.total} done</span>
          <div class="pa-bar"><div id="seChBar" style="width:${s.pct}%"></div></div>
        </div>
      </header>
      <div class="se-player" id="sePlayer" role="region" aria-label="Read-aloud lesson player">
        <button type="button" class="se-btn" data-g="start"${synth ? '' : ' disabled'}><span class="msr">play_circle</span><span class="lbl">Start lesson</span></button>
        <button type="button" class="se-btn sm ghost" data-g="pause" hidden></button>
        <button type="button" class="se-btn sm ghost" data-g="skip" hidden></button>
        <button type="button" class="se-btn sm ghost" data-g="stop" hidden><span class="msr">stop_circle</span>Stop</button>
        <span class="se-player-status" id="sePlayerStatus" aria-live="polite"></span>
        <label class="se-rate">Speed
          <select class="se-rate-select" id="seRate"${synth ? '' : ' disabled'}>${RATES.map(r => `<option value="${r[0]}"${String(state.rate || '0.95') === r[0] ? ' selected' : ''}>${r[1]}</option>`).join('')}</select>
        </label>
      </div>
      <div class="pa-celebrate${s.pct === 100 ? ' show' : ''}" id="seChDone" role="status"><span class="msr">celebration</span>Chapter finished! ${next ? 'Go to the next chapter when you are ready.' : 'This was the last chapter.'}</div>
      <section class="se-block" aria-labelledby="seLessonsH">
        <h3 id="seLessonsH"><span class="msr">menu_book</span>Lessons <small>${c.lessons.length} short reads</small></h3>
        <div class="se-lessons">${c.lessons.map(renderLesson).join('')}</div>
      </section>
      <section class="se-block" aria-labelledby="seExH">
        <h3 id="seExH"><span class="msr">exercise</span>Exercises <small>${c.exercises.length} to practise</small></h3>
        <div class="se-exs">${c.exercises.map(renderEx).join('')}</div>
      </section>
      <nav class="pa-pager se-pager" aria-label="Chapter navigation">
        ${prev ? `<a href="#${prev.id}" data-go="${i - 1}"><small><span class="msr">arrow_back</span>Previous chapter</small>${prev.title}</a>` : '<span></span>'}
        ${next ? `<a href="#${next.id}" class="next" data-go="${i + 1}"><small>Next chapter<span class="msr">arrow_forward</span></small>${next.title}</a>` : '<span></span>'}
      </nav>`;
    renderPlayer();
  }

  function refreshCard(id) {
    const hit = EX_INDEX[id];
    const el = document.getElementById('ex-' + id);
    if (!hit || !el) return;
    el.outerHTML = renderEx(hit.x, hit.i);
  }
  function refreshLesson(id) {
    const c = CHAPTERS[state.chapter];
    const i = c.lessons.findIndex(l => l.id === id);
    const el = document.getElementById(id);
    if (i < 0 || !el) return;
    el.outerHTML = renderLesson(c.lessons[i], i);
  }

  /* ---------- rendering: sidebar, hero, stats ---------- */
  function renderNav() {
    $('#seChapterNav').innerHTML = CHAPTERS.map((c, i) => {
      const p = chapterStats(c).pct, on = i === state.chapter;
      return `<a href="#${c.id}" class="pa-topic se-topic${on ? ' on' : ''}${p === 100 ? ' is-complete' : ''}" data-go="${i}"${on ? ' aria-current="page"' : ''}>
        <span class="msr">${p === 100 ? 'check_circle' : c.icon}</span><span class="se-topic-t">${c.title}</span><span class="se-topic-p">${p}%</span>
      </a>`;
    }).join('');
  }

  function updateProgress() {
    const t = totals();
    const ring = $('#seRing');
    ring.style.setProperty('--p', t.pct);
    ring.setAttribute('aria-label', `Overall progress ${t.pct} percent`);
    $('#seRingTxt').textContent = t.pct + '%';
    $('#seStLessons').textContent = `${t.Lr} / ${t.L}`;
    $('#seStEx').textContent = `${t.Ed} / ${t.E}`;
    $('#seStAcc').textContent = t.G ? Math.round((t.Gc / t.G) * 100) + '%' : '-';
    $('#seAllDone').hidden = t.pct !== 100;
    const s = chapterStats(CHAPTERS[state.chapter]);
    const bar = $('#seChBar');
    if (bar) bar.style.width = s.pct + '%';
    const cnt = $('#seChCount');
    if (cnt) cnt.textContent = `${s.lr + s.ed} of ${s.total} done`;
    const done = $('#seChDone');
    if (done) done.classList.toggle('show', s.pct === 100);
    renderNav();
  }

  function renderProfile() {
    const p = state.profile, m = me();
    $('#seHeroName').textContent = p.name;
    $('#seAvatar').textContent = (p.name.trim()[0] || '?').toUpperCase();
    $('#seProfName').textContent = p.name;
    const line = p.exp === 'yes'
      ? `${p.degree} · Experienced, previously at ${p.company}`
      : `${p.degree} · Fresher, ${parseInt(p.year, 10) > NOW_YEAR ? 'graduating' : 'passed out'} ${p.year}`;
    $('#seProfLine').textContent = line;
    const skills = $('#seProfSkills');
    skills.hidden = p.exp === 'yes' || !p.skills;
    skills.textContent = p.exp === 'yes' ? '' : 'Skills: ' + p.skills;
    $('#seHeroSub').innerHTML = m.exp
      ? `Five short chapters for you, with ${m.deg} and work experience at ${m.company}. Read a lesson, then practise it. Your progress shows on the left.`
      : `Five short chapters for you, with ${m.deg} and skills in ${m.skills}. Read a lesson, then practise it. Your progress shows on the left.`;
  }

  function updateClock() {
    const el = $('#seStTime');
    if (el) el.textContent = fmtLong(Date.now() - (state.startedAt || Date.now()));
  }

  /* ---------- navigation between chapters ---------- */
  function goChapter(i, scroll) {
    if (!(i >= 0 && i < CHAPTERS.length)) return;
    stopTimer(false);
    guideStop();
    ttsStop();
    guide.idx = 0;
    state.chapter = i;
    save();
    renderChapter();
    renderNav();
    try { history.replaceState(null, '', '#' + CHAPTERS[i].id); } catch (e) { /* ignore */ }
    if (scroll) {
      const top = $('#seCourseTop').getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      const h = $('#seChapter h2');
      if (h) h.focus({ preventScroll: true });
    }
  }

  /* ---------- chapter interactions ---------- */
  /* A card's own play button: stop the guided lesson first, toggle if this button is already playing */
  function playOnce(btn, text) {
    if (tts.btn === btn) { ttsStop(); return; }
    // While the guide waits for an answer, replaying something must not end the guided lesson
    if (!(guide.on && guide.waitId)) guideStop();
    ttsSpeak(text, { btn: btn });
  }

  function onChapterClick(e) {
    const g = e.target.closest('[data-g]');
    if (g) {
      const k = g.dataset.g;
      if (k === 'start') guideStart();
      else if (k === 'stop') guideStop();
      else if (k === 'skip') { ttsStop(); guideAdvance(); renderPlayer(); }
      else if (k === 'pause') { if (tts.paused) ttsResume(); else ttsPause(); renderPlayer(); }
      return;
    }
    const btn = e.target.closest('[data-act]');
    if (!btn || btn.tagName === 'INPUT') return;
    const id = btn.dataset.id, act = btn.dataset.act;

    if (act === 'listen') { playOnce(btn, lessonSpeech(id)); return; }

    if (act === 'read') {
      state.read[id] = !state.read[id];
      if (!state.read[id]) delete state.read[id];
      save(); refreshLesson(id); updateProgress();
      const again = $(`[data-act="read"][data-id="${id}"]`);
      if (again) again.focus();
      return;
    }

    const hit = EX_INDEX[id];
    if (!hit) return;
    const x = hit.x, r = rec(id);

    if (act === 'pick') {
      const k = parseInt(btn.dataset.k, 10);
      r.attempts = (r.attempts || 0) + 1;
      r.picked = k;
      if (k === x.answer && !r.done) { r.done = true; r.correct = r.attempts === 1; }
      save(); refreshCard(id); updateProgress();
      const fb = $(`#ex-${id} .se-fb`);
      if (fb) fb.focus();
      if (k === x.answer) guideFeedback(id, 'Correct.\n' + plain(`<p>${x.explain || ''}</p>`), true);
      else guideFeedback(id, 'Not correct. Press Try again and choose another answer.', false);
    } else if (act === 'readq') {
      playOnce(btn, exSpeech(x, hit.i));
    } else if (act === 'retry') {
      r.picked = null;
      save(); refreshCard(id);
      const first = $(`#ex-${id} .se-opt`);
      if (first) first.focus();
    } else if (act === 'reveal') {
      r.done = true; r.correct = false; r.revealed = true;
      r.value = x.show || x.accept[0];
      save(); refreshCard(id); updateProgress();
      const fb = $(`#ex-${id} .se-fb`);
      if (fb) fb.focus();
      guideFeedback(id, `The answer is: ${plain(`<p>${x.show || x.accept[0]}</p>`)}`, true);
    } else if (act === 'timer') {
      startTimer(id);
    } else if (act === 'play') {
      if (guide.on && guide.waitId === id) ttsSpeak(x.audio, { btn: btn });
      else playOnce(btn, x.audio);
    } else if (act === 'hear') {
      const box = document.getElementById('mdl-' + id);
      if (!box) return;
      if (guide.on && guide.waitId === id) ttsSpeak(speechOf(box), { btn: btn });
      else playOnce(btn, speechOf(box));
    } else if (act === 'practised') {
      r.done = !r.done;
      if (timer && timer.id === id) stopTimer(false);
      save(); refreshCard(id); updateProgress();
      const again = $(`[data-act="practised"][data-id="${id}"]`);
      if (again) again.focus();
      if (r.done) guideFeedback(id, 'Well done. Keep practising it out loud.', true);
    }
  }

  function onChapterSubmit(e) {
    const form = e.target.closest('.se-fill');
    if (!form) return;
    e.preventDefault();
    const id = form.dataset.id, x = EX_INDEX[id].x, r = rec(id);
    if (r.done) return;
    const input = form.elements.answer;
    const value = input.value.trim();
    if (!value) { input.focus(); return; }
    r.value = value;
    r.attempts = (r.attempts || 0) + 1;
    if (x.accept.some(a => norm(a) === norm(value))) {
      r.done = true;
      r.correct = r.attempts === 1;
    }
    save(); refreshCard(id); updateProgress();
    const fb = $(`#ex-${id} .se-fb`);
    if (r.done && fb) fb.focus();
    else {
      const again = $(`#ex-${id} .se-input`);
      if (again) { again.focus(); again.select(); }
    }
    if (r.done) guideFeedback(id, 'Correct.', true);
    else guideFeedback(id, 'Not correct. ' + plain(`<p>${x.hint || 'Try again.'}</p>`), false);
  }

  function onChapterChange(e) {
    const box = e.target;
    if (box.id === 'seRate') {
      state.rate = box.value;
      save();
      // While something is being read, the new speed applies from the next sentence
      if (!guide.on && !tts.btn) ttsSpeak('This is the new reading speed.');
      return;
    }
    if (!box.matches('[data-act="check"]')) return;
    const r = rec(box.dataset.id);
    r.checks = r.checks || [];
    r.checks[parseInt(box.dataset.k, 10)] = box.checked;
    save();
  }

  /* ---------- onboarding ---------- */
  const STEPS = ['name', 'degree', 'exp', 'details'];
  let obStep = 0;

  function fillYears() {
    const sel = $('#seYear');
    if (sel.options.length > 1) return;
    for (let y = NOW_YEAR + 2; y >= NOW_YEAR - 15; y--) {
      const o = document.createElement('option');
      o.value = String(y);
      o.textContent = y > NOW_YEAR ? `${y} (expected)` : String(y);
      sel.appendChild(o);
    }
  }

  function obExp() {
    const r = $('input[name="seExp"]:checked');
    return r ? r.value : '';
  }

  function renderStep() {
    const editing = !!state.profile;
    $$('.se-ob-step').forEach(fs => { fs.hidden = fs.dataset.step !== STEPS[obStep]; });
    $$('.se-ob-dots span').forEach((d, i) => { d.classList.toggle('on', i <= obStep); });
    $('#seObCount').textContent = `Step ${obStep + 1} of ${STEPS.length}`;
    $('#seObBack').hidden = obStep === 0;
    $('#seObCancel').hidden = !editing;
    const last = obStep === STEPS.length - 1;
    $('#seObNext').innerHTML = last
      ? `<span>${editing ? 'Save changes' : 'Start learning'}</span><span class="msr">${editing ? 'save' : 'rocket_launch'}</span>`
      : `<span>Next</span><span class="msr">arrow_forward</span>`;
    const exp = obExp();
    $('#seObYes').hidden = exp !== 'yes';
    $('#seObNo').hidden = exp !== 'no';
    $('#seObErr').textContent = '';
    const step = $(`.se-ob-step[data-step="${STEPS[obStep]}"]`);
    const first = step && $(STEPS[obStep] === 'exp' ? 'input[name="seExp"]:checked, input[name="seExp"]' : 'input:not([hidden]):not([type=radio]), select, textarea', step);
    const target = STEPS[obStep] === 'details' ? (exp === 'yes' ? $('#seCompany') : $('#seYear')) : first;
    if (target) target.focus();
  }

  function validateStep() {
    const s = STEPS[obStep];
    if (s === 'name') {
      const v = $('#seName').value.trim();
      if (v.length < 2) return ['Please enter your name (at least 2 letters).', '#seName'];
    } else if (s === 'degree') {
      if (!$('#seDegree').value) return ['Please choose your degree from the list.', '#seDegree'];
    } else if (s === 'exp') {
      if (!obExp()) return ['Please choose whether you have work experience.', 'input[name="seExp"]'];
    } else if (s === 'details') {
      if (obExp() === 'yes') {
        if ($('#seCompany').value.trim().length < 2) return ['Please enter the name of your previous company.', '#seCompany'];
      } else {
        if (!$('#seYear').value) return ['Please choose your year of passing.', '#seYear'];
        if ($('#seSkills').value.trim().length < 2) return ['Please list the skills you know in your tech stack.', '#seSkills'];
      }
    }
    return null;
  }

  function onObSubmit(e) {
    e.preventDefault();
    const err = validateStep();
    if (err) {
      $('#seObErr').textContent = err[0];
      const f = $(err[1]);
      if (f) f.focus();
      return;
    }
    if (obStep < STEPS.length - 1) { obStep++; renderStep(); return; }
    const exp = obExp();
    const profile = {
      name: $('#seName').value.trim().replace(/\s+/g, ' ').slice(0, 40),
      degree: $('#seDegree').value,
      exp: exp,
      company: exp === 'yes' ? $('#seCompany').value.trim().replace(/\s+/g, ' ').slice(0, 60) : '',
      year: exp === 'yes' ? '' : $('#seYear').value,
      skills: exp === 'yes' ? '' : $('#seSkills').value.trim().replace(/\s+/g, ' ').slice(0, 200)
    };
    if (state.profile) state.profile = profile;
    else state = blank(profile);
    save();
    showCourse();
  }

  function showOnboard() {
    stopTimer(false);
    guideStop();
    ttsStop();
    fillYears();
    const p = state.profile;
    if (p) {
      $('#seName').value = p.name || '';
      $('#seDegree').value = p.degree || '';
      $$('input[name="seExp"]').forEach(r => { r.checked = r.value === p.exp; });
      $('#seCompany').value = p.company || '';
      $('#seYear').value = p.year || '';
      $('#seSkills').value = p.skills || '';
    }
    $('#seCourse').hidden = true;
    $('#seOnboard').hidden = false;
    obStep = 0;
    window.scrollTo(0, 0);
    renderStep();
  }

  function showCourse() {
    $('#seOnboard').hidden = true;
    $('#seCourse').hidden = false;
    const fromHash = CHAPTERS.findIndex(c => '#' + c.id === location.hash);
    if (fromHash >= 0) state.chapter = fromHash;
    renderProfile();
    renderChapter();
    updateProgress();
    updateClock();
    window.scrollTo(0, 0);
  }

  /* ---------- wire up ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    $('#seObForm').addEventListener('submit', onObSubmit);
    $('#seObBack').addEventListener('click', () => { if (obStep > 0) { obStep--; renderStep(); } });
    $('#seObCancel').addEventListener('click', showCourse);
    $$('input[name="seExp"]').forEach(r => r.addEventListener('change', () => {
      $('#seObErr').textContent = '';
      setTimeout(() => { if (STEPS[obStep] === 'exp') { obStep++; renderStep(); } }, 220);
    }));

    const ch = chapterEl();
    ch.addEventListener('click', onChapterClick);
    ch.addEventListener('submit', onChapterSubmit);
    ch.addEventListener('change', onChapterChange);

    document.addEventListener('click', e => {
      const a = e.target.closest('[data-go]');
      if (!a) return;
      e.preventDefault();
      goChapter(parseInt(a.dataset.go, 10), true);
    });
    window.addEventListener('hashchange', () => {
      const i = CHAPTERS.findIndex(c => '#' + c.id === location.hash);
      if (i >= 0 && i !== state.chapter && !$('#seCourse').hidden) goChapter(i, true);
    });

    $('#seEdit').addEventListener('click', showOnboard);
    $('#seReset').addEventListener('click', () => {
      if (!window.confirm('Clear every lesson and exercise you have completed in this session? Your details stay.')) return;
      stopTimer(false);
      guideStop();
      guide.idx = 0;
      state.read = {};
      state.ex = {};
      state.startedAt = Date.now();
      save();
      renderChapter();
      updateProgress();
      updateClock();
    });

    setInterval(updateClock, 1000);
    if (state.profile) showCourse(); else showOnboard();
  });
})();
