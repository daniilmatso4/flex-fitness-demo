// ============================================
// FLEX FITNESS OC — AI AGENT DEMO ENGINE
// ============================================

// --- STATE ---
let stats = { detected: 0, dms: 0, leads: 0 };
let dmActive = false;
let processing = false;

// --- KEYWORD RESPONSE DATABASE ---
// Each keyword maps to a full DM conversation flow
const KEYWORD_FLOWS = {
    INFO: {
        agentSteps: [
            { type: 'detect', text: 'Keyword "INFO" detected from @you_fitness' },
            { type: 'ai', text: 'AI generating personalized welcome message...' },
            { type: 'action', text: 'Opening DM channel with @you_fitness' },
            { type: 'success', text: 'DM delivered — conversation started' },
        ],
        messages: [
            {
                from: 'bot',
                text: "Hey! Thanks for your interest in Flex Fitness OC — Orange County's premier bodybuilding gym. We're located at 23641 Ridge Route Dr, Suite B, Laguna Hills.",
                delay: 800,
            },
            {
                from: 'bot',
                text: "Here's what makes us different:\n\n- Elite equipment (Panatta, Arsenal, Rogue)\n- 24/7 member access\n- Real coaching, not just a gym floor\n- Dry hot sauna & red light therapy\n- Chef-made meal plans by Elemental Fit\n- Spotless facility — always",
                delay: 1800,
            },
            {
                from: 'bot',
                text: "We're not your average gym. You'll be known by name here. What are you most interested in?",
                delay: 2600,
            },
        ],
        quickReplies: ['Membership pricing', 'Personal training', 'Book a tour', 'Hours'],
        followUps: {
            'Membership pricing': [
                {
                    from: 'user',
                    text: 'Membership pricing',
                    delay: 0,
                },
                {
                    from: 'bot',
                    text: "Great question! We have two membership tiers:\n\n24/7 Access: $120/mo (+ $170 signup)\nStaffed Hours: $84.95/mo (+ $184 signup)\n\nWe're currently running 100% off enrollment — so zero signup cost right now.",
                    delay: 1200,
                },
                {
                    from: 'bot',
                    text: "Want to come see the gym before committing? I can set you up with a tour — just let me know what day works for you.",
                    delay: 2200,
                },
            ],
            'Personal training': [
                {
                    from: 'user',
                    text: 'Personal training',
                    delay: 0,
                },
                {
                    from: 'bot',
                    text: "Our coaches build fully custom training plans based on your goals, schedule, and experience level. Whether it's bodybuilding, powerlifting, contest prep, or general fitness — we've got you.",
                    delay: 1200,
                },
                {
                    from: 'bot',
                    text: "Our featured coaches are Beni Magyar, Aroosha, Sarah Sweet, and Evana. Want me to connect you with one of them for a free consultation?",
                    delay: 2200,
                },
            ],
            'Book a tour': [
                {
                    from: 'user',
                    text: 'Book a tour',
                    delay: 0,
                },
                {
                    from: 'bot',
                    text: "Let's get you in! We're staffed:\n\nMon–Thu: 5 AM – 9 PM\nFri: 8 AM – 8 PM\nSat–Sun: 8 AM – 7 PM\n\nWhat day and time works best for you? Tony or one of our staff will show you around personally.",
                    delay: 1200,
                },
            ],
            'Hours': [
                {
                    from: 'user',
                    text: 'Hours',
                    delay: 0,
                },
                {
                    from: 'bot',
                    text: "Staffed hours:\n\nMon–Thu: 5 AM – 9 PM\nFri: 8 AM – 8 PM\nSat–Sun: 8 AM – 7 PM\n\n24/7 members can access the gym anytime with their key fob. Want to come check us out?",
                    delay: 1200,
                },
            ],
        },
    },

    PRICING: {
        agentSteps: [
            { type: 'detect', text: 'Keyword "PRICING" detected from @you_fitness' },
            { type: 'ai', text: 'AI crafting pricing breakdown with current promo...' },
            { type: 'action', text: 'Opening DM channel with @you_fitness' },
            { type: 'success', text: 'DM delivered — high-intent lead captured' },
        ],
        messages: [
            {
                from: 'bot',
                text: "Hey! Glad you asked about pricing — let me break it down for you.",
                delay: 800,
            },
            {
                from: 'bot',
                text: "Membership options:\n\n24/7 Access — $120/month\n(Full gym access anytime, key fob entry)\n\nStaffed Hours — $84.95/month\n(Access during staffed hours only)\n\nDay Pass — $45 | 3-Day — $85 | 1-Week — $125",
                delay: 1800,
            },
            {
                from: 'bot',
                text: "Right now we're running 100% off enrollment — that means zero signup fees. This won't last forever though.",
                delay: 2800,
            },
            {
                from: 'bot',
                text: "Want to lock that in? I can book you a quick tour so you can see the space first.",
                delay: 3600,
            },
        ],
        quickReplies: ['Book a tour', 'What equipment do you have?', 'Do you have personal trainers?'],
        followUps: {
            'Book a tour': [
                { from: 'user', text: 'Book a tour', delay: 0 },
                {
                    from: 'bot',
                    text: "Awesome! We're at 23641 Ridge Route Dr, Suite B, Laguna Hills. Staffed hours are Mon–Thu 5AM–9PM, Fri 8AM–8PM, Sat–Sun 8AM–7PM. What day works for you? I'll let Tony know you're coming.",
                    delay: 1200,
                },
            ],
            'What equipment do you have?': [
                { from: 'user', text: 'What equipment do you have?', delay: 0 },
                {
                    from: 'bot',
                    text: "We carry top-of-the-line brands:\n\n- Panatta (Italian-made machines)\n- Arsenal Strength\n- Rogue (barbells, racks, platforms)\n- FreeMotion cable systems\n\nPlus a dedicated posing room, dry sauna, and red light therapy. It's a serious training environment.",
                    delay: 1200,
                },
            ],
            'Do you have personal trainers?': [
                { from: 'user', text: 'Do you have personal trainers?', delay: 0 },
                {
                    from: 'bot',
                    text: "Absolutely. Our coaches specialize in bodybuilding, powerlifting, contest prep, and custom programming. Featured trainers: Beni Magyar, Aroosha, Sarah Sweet, and Evana. Want me to connect you?",
                    delay: 1200,
                },
            ],
        },
    },

    TRAINING: {
        agentSteps: [
            { type: 'detect', text: 'Keyword "TRAINING" detected from @you_fitness' },
            { type: 'ai', text: 'AI building personalized training pitch...' },
            { type: 'action', text: 'Opening DM channel with @you_fitness' },
            { type: 'success', text: 'DM delivered — training inquiry captured' },
        ],
        messages: [
            {
                from: 'bot',
                text: "Hey! You're interested in training — love to hear it. At Flex Fitness OC, coaching is what sets us apart.",
                delay: 800,
            },
            {
                from: 'bot',
                text: "Our trainers build fully custom programs based on your goals:\n\n- Bodybuilding & hypertrophy\n- Powerlifting & strength\n- Contest prep (men's & women's)\n- Booty building programs\n- General fitness & body recomp\n\nEvery plan includes coach check-ins to keep you on track.",
                delay: 1800,
            },
            {
                from: 'bot',
                text: "Our featured coaches:\n\nBeni Magyar — Bodybuilding specialist\nAroosha — Women's training & contest prep\nSarah Sweet — Strength & conditioning\nEvana — Custom programming",
                delay: 2800,
            },
            {
                from: 'bot',
                text: "Want me to connect you with one of them for a free intro consultation?",
                delay: 3600,
            },
        ],
        quickReplies: ['Yes, connect me!', 'What does training cost?', 'I want contest prep'],
        followUps: {
            'Yes, connect me!': [
                { from: 'user', text: 'Yes, connect me!', delay: 0 },
                {
                    from: 'bot',
                    text: "Let's do it! What's your first name and what are your main fitness goals? I'll pass it along to the coach who's the best fit for you and they'll reach out directly.",
                    delay: 1200,
                },
            ],
            'What does training cost?': [
                { from: 'user', text: 'What does training cost?', delay: 0 },
                {
                    from: 'bot',
                    text: "Training packages are customized based on the coach and how many sessions per week you want. The best way to get an exact number is to come in for a free consultation — no pressure, just a conversation about your goals. Want me to book that?",
                    delay: 1200,
                },
            ],
            'I want contest prep': [
                { from: 'user', text: 'I want contest prep', delay: 0 },
                {
                    from: 'bot',
                    text: "We've got you covered. Our coaches have prepped competitors for NPC, IFBB, and local shows. We handle training, nutrition, posing practice (we have a dedicated posing room), and peak week strategy. When's your show? Let's get you dialed in.",
                    delay: 1200,
                },
            ],
        },
    },

    TOUR: {
        agentSteps: [
            { type: 'detect', text: 'Keyword "TOUR" detected from @you_fitness' },
            { type: 'ai', text: 'AI generating tour booking flow...' },
            { type: 'action', text: 'Opening DM channel with @you_fitness' },
            { type: 'success', text: 'DM delivered — tour booking initiated' },
        ],
        messages: [
            {
                from: 'bot',
                text: "Hey! Would love to show you around Flex Fitness OC. Seeing the space in person is the best way to understand what we're about.",
                delay: 800,
            },
            {
                from: 'bot',
                text: "We're at 23641 Ridge Route Dr, Suite B, Laguna Hills — easy to find, right off the 5.\n\nStaffed hours for tours:\nMon–Thu: 5 AM – 9 PM\nFri: 8 AM – 8 PM\nSat–Sun: 8 AM – 7 PM",
                delay: 1800,
            },
            {
                from: 'bot',
                text: "What day and time works best for you? Tony or one of our team will give you the full walkthrough — equipment floor, sauna, red light therapy room, everything.",
                delay: 2800,
            },
        ],
        quickReplies: ['This week', 'This weekend', 'What should I expect?'],
        followUps: {
            'This week': [
                { from: 'user', text: 'This week', delay: 0 },
                {
                    from: 'bot',
                    text: "Perfect! Any preferred day? Morning or evening? I'll get you on the schedule and send a confirmation. Also — we're running 100% off enrollment right now, so if you love what you see, you can lock that in same day.",
                    delay: 1200,
                },
            ],
            'This weekend': [
                { from: 'user', text: 'This weekend', delay: 0 },
                {
                    from: 'bot',
                    text: "Weekends are great — we're staffed Sat–Sun 8 AM – 7 PM. Saturday morning tends to have the best energy in the gym. Want me to pencil you in? And don't forget — 100% off enrollment is happening now.",
                    delay: 1200,
                },
            ],
            'What should I expect?': [
                { from: 'user', text: 'What should I expect?', delay: 0 },
                {
                    from: 'bot',
                    text: "A full walkthrough of the gym floor — you'll see our Panatta, Arsenal, and Rogue equipment. We'll show you the dry sauna, red light therapy room, posing room, and showers. No hard sell — just a real look at the space. Most people sign up on the spot because the vibe speaks for itself. When can you come by?",
                    delay: 1200,
                },
            ],
        },
    },

    HOURS: {
        agentSteps: [
            { type: 'detect', text: 'Keyword "HOURS" detected from @you_fitness' },
            { type: 'ai', text: 'AI pulling schedule information...' },
            { type: 'action', text: 'Opening DM channel with @you_fitness' },
            { type: 'success', text: 'DM delivered' },
        ],
        messages: [
            {
                from: 'bot',
                text: "Hey! Here are our hours at Flex Fitness OC:",
                delay: 800,
            },
            {
                from: 'bot',
                text: "Staffed Hours:\nMon–Thu: 5:00 AM – 9:00 PM\nFri: 8:00 AM – 8:00 PM\nSat–Sun: 8:00 AM – 7:00 PM\n\n24/7 members can access the gym anytime with their key fob — even holidays.",
                delay: 1600,
            },
            {
                from: 'bot',
                text: "We're at 23641 Ridge Route Dr, Suite B, Laguna Hills — right off the 5 freeway. Want to come check it out?",
                delay: 2400,
            },
        ],
        quickReplies: ['Book a tour', 'Membership pricing', 'What equipment do you have?'],
        followUps: {
            'Book a tour': [
                { from: 'user', text: 'Book a tour', delay: 0 },
                {
                    from: 'bot',
                    text: "Let's do it! What day and time works for you? Tony or our staff will show you around personally. And heads up — we're running 100% off enrollment right now.",
                    delay: 1200,
                },
            ],
            'Membership pricing': [
                { from: 'user', text: 'Membership pricing', delay: 0 },
                {
                    from: 'bot',
                    text: "24/7 Access — $120/mo | Staffed Hours — $84.95/mo\n\nWe're currently offering 100% off enrollment (normally $170–$184). Want to lock that in with a tour?",
                    delay: 1200,
                },
            ],
            'What equipment do you have?': [
                { from: 'user', text: 'What equipment do you have?', delay: 0 },
                {
                    from: 'bot',
                    text: "Top-tier brands: Panatta (Italian-made), Arsenal Strength, Rogue, FreeMotion. Plus a dedicated posing room, dry hot sauna, and LightStim red light therapy. Come see it in person — it hits different.",
                    delay: 1200,
                },
            ],
        },
    },

    SAUNA: {
        agentSteps: [
            { type: 'detect', text: 'Keyword "SAUNA" detected from @you_fitness' },
            { type: 'ai', text: 'AI generating recovery amenities info...' },
            { type: 'action', text: 'Opening DM channel with @you_fitness' },
            { type: 'success', text: 'DM delivered' },
        ],
        messages: [
            {
                from: 'bot',
                text: "Hey! Great question — recovery is a big part of what we offer at Flex Fitness OC.",
                delay: 800,
            },
            {
                from: 'bot',
                text: "We have a dry hot sauna available to all members — perfect for post-workout recovery, muscle relaxation, and detox.\n\nWe also offer LightStim Red Light Therapy sessions that support circulation, recovery, and skin health.",
                delay: 1800,
            },
            {
                from: 'bot',
                text: "Both are included with your membership — no extra fees. Want to come check out the facilities?",
                delay: 2600,
            },
        ],
        quickReplies: ['Book a tour', 'Membership pricing', 'What else do you offer?'],
        followUps: {
            'Book a tour': [
                { from: 'user', text: 'Book a tour', delay: 0 },
                {
                    from: 'bot',
                    text: "We'd love to have you! What day works? We're staffed Mon–Thu 5AM–9PM, Fri 8AM–8PM, Sat–Sun 8AM–7PM. We'll show you the full facility including the sauna and red light room.",
                    delay: 1200,
                },
            ],
            'Membership pricing': [
                { from: 'user', text: 'Membership pricing', delay: 0 },
                {
                    from: 'bot',
                    text: "24/7 Access — $120/mo | Staffed Hours — $84.95/mo. Both include sauna and recovery amenities. Plus, we're running 100% off enrollment right now.",
                    delay: 1200,
                },
            ],
            'What else do you offer?': [
                { from: 'user', text: 'What else do you offer?', delay: 0 },
                {
                    from: 'bot',
                    text: "Beyond the sauna and red light therapy:\n\n- Elite equipment floor (Panatta, Arsenal, Rogue)\n- Personal training & custom programming\n- Contest prep coaching\n- Posing room\n- Elemental Fit Meals (chef-made, ready to eat)\n- 24/7 access\n\nIt's a full training ecosystem. Come see it for yourself!",
                    delay: 1200,
                },
            ],
        },
    },

    MEALS: {
        agentSteps: [
            { type: 'detect', text: 'Keyword "MEALS" detected from @you_fitness' },
            { type: 'ai', text: 'AI building nutrition & meal plan response...' },
            { type: 'action', text: 'Opening DM channel with @you_fitness' },
            { type: 'success', text: 'DM delivered — nutrition lead captured' },
        ],
        messages: [
            {
                from: 'bot',
                text: "Hey! Nutrition is half the battle — glad you're thinking about it.",
                delay: 800,
            },
            {
                from: 'bot',
                text: "We partner with Elemental Fit Meals — chef-made, macro-friendly meals ready to eat. No cooking, no guesswork. They're available right here at the gym.\n\nOur coaches also offer full nutrition guidance as part of training packages.",
                delay: 1800,
            },
            {
                from: 'bot',
                text: "Whether you're prepping for a show, cutting, bulking, or just eating cleaner — we can help you dial it in. Want to learn more about our training + nutrition packages?",
                delay: 2800,
            },
        ],
        quickReplies: ['Tell me about training', 'Membership pricing', 'Book a tour'],
        followUps: {
            'Tell me about training': [
                { from: 'user', text: 'Tell me about training', delay: 0 },
                {
                    from: 'bot',
                    text: "Our coaches build custom programs based on your goals: bodybuilding, powerlifting, contest prep, body recomp — you name it. Training packages include nutrition guidance so everything works together. Want a free consultation with one of our coaches?",
                    delay: 1200,
                },
            ],
            'Membership pricing': [
                { from: 'user', text: 'Membership pricing', delay: 0 },
                {
                    from: 'bot',
                    text: "24/7 Access — $120/mo | Staffed Hours — $84.95/mo. Currently 100% off enrollment. Meal plans and training are separate but we can bundle everything. Come in for a tour and we'll put together a plan that fits your goals and budget.",
                    delay: 1200,
                },
            ],
            'Book a tour': [
                { from: 'user', text: 'Book a tour', delay: 0 },
                {
                    from: 'bot',
                    text: "Let's get you in! We're at 23641 Ridge Route Dr, Suite B, Laguna Hills. Staffed Mon–Thu 5AM–9PM, Fri 8AM–8PM, Sat–Sun 8AM–7PM. What day works for you?",
                    delay: 1200,
                },
            ],
        },
    },
};

// --- FAKE COMMENTER NAMES ---
const FAKE_NAMES = [
    'jake_gains', 'fitlife_mia', 'oc_runner', 'liftqueen23', 'carlos.fit',
    'jenny_shreds', 'maxpower_oc', 'yogawithsam', 'the_real_benchpress', 'dana.health',
];

// --- UTILITY FUNCTIONS ---

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function updateStats() {
    document.getElementById('stat-detected').textContent = stats.detected;
    document.getElementById('stat-dms').textContent = stats.dms;
    document.getElementById('stat-leads').textContent = stats.leads;
}

function scrollToBottom(el) {
    el.scrollTop = el.scrollHeight;
}

// --- INTRO ---

function startDemo() {
    const overlay = document.getElementById('intro-overlay');
    overlay.classList.add('fade-out');
    setTimeout(() => {
        overlay.style.display = 'none';
        const container = document.getElementById('demo-container');
        container.classList.remove('hidden');
        container.classList.add('fade-in');
    }, 600);
}

// --- COMMENTS ---

function postComment() {
    const input = document.getElementById('comment-input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    addComment('you_fitness', text, true);
}

function quickComment(keyword) {
    addComment('you_fitness', keyword, true);
}

function addComment(username, text, isUser = false) {
    if (processing) return;

    const section = document.getElementById('comments-section');
    const div = document.createElement('div');
    div.className = 'comment' + (isUser ? ' user-comment' : '');
    div.innerHTML = `<strong>${username}</strong> ${text}`;
    section.appendChild(div);
    scrollToBottom(section);

    // Check for keyword match
    const keyword = text.toUpperCase().trim();
    if (KEYWORD_FLOWS[keyword]) {
        processing = true;

        // Mark comment as keyword
        setTimeout(() => {
            div.classList.add('keyword-detected');
        }, 400);

        triggerAgent(keyword);
    }
}

// --- AGENT ---

async function triggerAgent(keyword) {
    const flow = KEYWORD_FLOWS[keyword];
    const log = document.getElementById('agent-log');

    // Clear idle state
    log.innerHTML = '';

    // Step through agent activity
    for (let i = 0; i < flow.agentSteps.length; i++) {
        const step = flow.agentSteps[i];
        await sleep(600 + i * 200);

        const entry = document.createElement('div');
        entry.className = `agent-entry ${step.type}`;
        entry.innerHTML = `<div class="agent-dot"></div><span>${step.text}</span>`;
        log.appendChild(entry);
        scrollToBottom(log);

        // Update stats at appropriate steps
        if (step.type === 'detect') {
            stats.detected++;
            updateStats();
        }
        if (step.type === 'success') {
            stats.dms++;
            stats.leads++;
            updateStats();
        }
    }

    // Trigger DM conversation
    await sleep(400);
    startDMConversation(keyword);
}

// --- DM CONVERSATION ---

async function startDMConversation(keyword) {
    const flow = KEYWORD_FLOWS[keyword];
    const container = document.getElementById('dm-container');

    // Build DM structure
    container.innerHTML = `
        <div class="dm-thread">
            <div class="dm-header">
                <div class="dm-header-avatar">FF</div>
                <div class="dm-header-info">
                    <span class="dm-header-name">flexfitnessoc</span>
                    <span class="dm-header-status">Active now</span>
                </div>
            </div>
            <div class="dm-messages" id="dm-messages"></div>
            <div class="dm-quick-replies" id="dm-quick-replies" style="display:none;"></div>
        </div>
    `;

    const messagesEl = document.getElementById('dm-messages');

    // Send each message with typing indicator
    for (const msg of flow.messages) {
        // Show typing indicator
        await sleep(msg.delay);
        if (msg.from === 'bot') {
            const typing = document.createElement('div');
            typing.className = 'dm-typing';
            typing.id = 'typing-indicator';
            typing.innerHTML = '<span></span><span></span><span></span>';
            messagesEl.appendChild(typing);
            scrollToBottom(messagesEl);

            await sleep(800 + Math.random() * 600);

            // Remove typing, add message
            typing.remove();
        }

        const msgEl = document.createElement('div');
        msgEl.className = `dm-msg ${msg.from}`;
        msgEl.textContent = msg.text;
        messagesEl.appendChild(msgEl);
        scrollToBottom(messagesEl);
    }

    // Show quick replies
    await sleep(600);
    showQuickReplies(keyword);
    processing = false;
}

function showQuickReplies(keyword) {
    const flow = KEYWORD_FLOWS[keyword];
    const repliesEl = document.getElementById('dm-quick-replies');
    repliesEl.style.display = 'flex';
    repliesEl.innerHTML = '';

    flow.quickReplies.forEach(reply => {
        const btn = document.createElement('button');
        btn.className = 'dm-quick-btn';
        btn.textContent = reply;
        btn.onclick = () => handleQuickReply(keyword, reply);
        repliesEl.appendChild(btn);
    });
}

async function handleQuickReply(keyword, reply) {
    if (processing) return;
    processing = true;

    const flow = KEYWORD_FLOWS[keyword];
    const followUp = flow.followUps[reply];
    if (!followUp) { processing = false; return; }

    // Hide quick replies
    const repliesEl = document.getElementById('dm-quick-replies');
    repliesEl.style.display = 'none';

    const messagesEl = document.getElementById('dm-messages');

    // Log agent activity
    const log = document.getElementById('agent-log');
    const entry = document.createElement('div');
    entry.className = 'agent-entry ai';
    entry.innerHTML = `<div class="agent-dot"></div><span>User replied "${reply}" — AI generating response...</span>`;
    log.appendChild(entry);
    scrollToBottom(log);

    for (const msg of followUp) {
        await sleep(msg.delay);

        if (msg.from === 'bot') {
            const typing = document.createElement('div');
            typing.className = 'dm-typing';
            typing.innerHTML = '<span></span><span></span><span></span>';
            messagesEl.appendChild(typing);
            scrollToBottom(messagesEl);

            await sleep(800 + Math.random() * 400);
            typing.remove();
        }

        const msgEl = document.createElement('div');
        msgEl.className = `dm-msg ${msg.from}`;
        msgEl.textContent = msg.text;
        messagesEl.appendChild(msgEl);
        scrollToBottom(messagesEl);
    }

    // Log success
    const successEntry = document.createElement('div');
    successEntry.className = 'agent-entry success';
    successEntry.innerHTML = `<div class="agent-dot"></div><span>Follow-up delivered — lead engaged</span>`;
    log.appendChild(successEntry);
    scrollToBottom(log);

    // Show remaining quick replies (minus the one used)
    await sleep(500);
    const remaining = flow.quickReplies.filter(r => r !== reply);
    if (remaining.length > 0) {
        repliesEl.style.display = 'flex';
        repliesEl.innerHTML = '';
        remaining.forEach(r => {
            const btn = document.createElement('button');
            btn.className = 'dm-quick-btn';
            btn.textContent = r;
            btn.onclick = () => handleQuickReply(keyword, r);
            repliesEl.appendChild(btn);
        });
    }

    processing = false;
}

// --- RESET ---

function resetDemo() {
    stats = { detected: 0, dms: 0, leads: 0 };
    updateStats();
    processing = false;

    // Reset comments
    document.getElementById('comments-section').innerHTML = `
        <div class="comment existing"><strong>mike_lifts92</strong> This gym looks insane</div>
        <div class="comment existing"><strong>sarah_fitjourney</strong> Best gym in OC hands down</div>
    `;

    // Reset agent log
    document.getElementById('agent-log').innerHTML = `
        <div class="agent-entry idle">
            <div class="agent-dot"></div>
            <span>Agent standing by — monitoring comments...</span>
        </div>
    `;

    // Reset DM
    document.getElementById('dm-container').innerHTML = `
        <div class="dm-placeholder">
            <div class="dm-placeholder-icon">
                <svg viewBox="0 0 24 24" width="48" height="48"><line x1="22" y1="3" x2="9.218" y2="10.083" fill="none" stroke="#555" stroke-width="1.5"/><polygon points="22 3 15 22 11 13 2 9 22 3" fill="none" stroke="#555" stroke-width="1.5" stroke-linejoin="round"/></svg>
            </div>
            <p>DM conversation will appear here when a keyword is detected</p>
        </div>
    `;
}

// --- KEYBOARD SHORTCUTS ---

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('comment-input');
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            postComment();
        }
    });
});
