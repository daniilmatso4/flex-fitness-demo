// ============================================
// FLEX FITNESS OC — AI AGENT DEMO ENGINE
// ============================================

let stats = { detected: 0, dms: 0, leads: 0 };
let processing = false;

// --- KEYWORD RESPONSE DATABASE ---
const KEYWORD_FLOWS = {
    INFO: {
        agentSteps: [
            { type: 'detect', text: 'Keyword "INFO" detected from @you_fitness' },
            { type: 'ai', text: 'AI generating personalized welcome message...' },
            { type: 'action', text: 'Opening DM channel with @you_fitness' },
            { type: 'success', text: 'DM delivered — conversation started' },
        ],
        messages: [
            { from: 'bot', text: "Hey! Thanks for your interest in Flex Fitness OC — Orange County's premier bodybuilding gym. We're located at 23641 Ridge Route Dr, Suite B, Laguna Hills.", delay: 800 },
            { from: 'bot', text: "Here's what makes us different:\n\n- Elite equipment (Panatta, Arsenal, Rogue)\n- 24/7 member access\n- Real coaching, not just a gym floor\n- Dry hot sauna & red light therapy\n- Chef-made meal plans by Elemental Fit\n- Spotless facility — always", delay: 1800 },
            { from: 'bot', text: "We're not your average gym. You'll be known by name here. What are you most interested in?", delay: 2600 },
        ],
        quickReplies: ['Membership pricing', 'Personal training', 'Book a tour', 'Hours'],
        followUps: {
            'Membership pricing': [
                { from: 'user', text: 'Membership pricing', delay: 0 },
                { from: 'bot', text: "Great question! We have two membership tiers:\n\n24/7 Access: $120/mo (+ $170 signup)\nStaffed Hours: $84.95/mo (+ $184 signup)\n\nWe're currently running 100% off enrollment — so zero signup cost right now.", delay: 1200 },
                { from: 'bot', text: "Want to come see the gym before committing? I can set you up with a tour — just let me know what day works for you.", delay: 2200 },
            ],
            'Personal training': [
                { from: 'user', text: 'Personal training', delay: 0 },
                { from: 'bot', text: "Our coaches build fully custom training plans based on your goals, schedule, and experience level. Whether it's bodybuilding, powerlifting, contest prep, or general fitness — we've got you.", delay: 1200 },
                { from: 'bot', text: "Our featured coaches are Beni Magyar, Aroosha, Sarah Sweet, and Evana. Want me to connect you with one of them for a free consultation?", delay: 2200 },
            ],
            'Book a tour': [
                { from: 'user', text: 'Book a tour', delay: 0 },
                { from: 'bot', text: "Let's get you in! We're staffed:\n\nMon–Thu: 5 AM – 9 PM\nFri: 8 AM – 8 PM\nSat–Sun: 8 AM – 7 PM\n\nWhat day and time works best for you? Tony or one of our staff will show you around personally.", delay: 1200 },
            ],
            'Hours': [
                { from: 'user', text: 'Hours', delay: 0 },
                { from: 'bot', text: "Staffed hours:\n\nMon–Thu: 5 AM – 9 PM\nFri: 8 AM – 8 PM\nSat–Sun: 8 AM – 7 PM\n\n24/7 members can access the gym anytime with their key fob. Want to come check us out?", delay: 1200 },
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
            { from: 'bot', text: "Hey! Glad you asked about pricing — let me break it down for you.", delay: 800 },
            { from: 'bot', text: "Membership options:\n\n24/7 Access — $120/month\n(Full gym access anytime, key fob entry)\n\nStaffed Hours — $84.95/month\n(Access during staffed hours only)\n\nDay Pass — $45 | 3-Day — $85 | 1-Week — $125", delay: 1800 },
            { from: 'bot', text: "Right now we're running 100% off enrollment — that means zero signup fees. This won't last forever though.", delay: 2800 },
            { from: 'bot', text: "Want to lock that in? I can book you a quick tour so you can see the space first.", delay: 3600 },
        ],
        quickReplies: ['Book a tour', 'What equipment do you have?', 'Do you have personal trainers?'],
        followUps: {
            'Book a tour': [
                { from: 'user', text: 'Book a tour', delay: 0 },
                { from: 'bot', text: "Awesome! We're at 23641 Ridge Route Dr, Suite B, Laguna Hills. Staffed hours are Mon–Thu 5AM–9PM, Fri 8AM–8PM, Sat–Sun 8AM–7PM. What day works for you? I'll let Tony know you're coming.", delay: 1200 },
            ],
            'What equipment do you have?': [
                { from: 'user', text: 'What equipment do you have?', delay: 0 },
                { from: 'bot', text: "We carry top-of-the-line brands:\n\n- Panatta (Italian-made machines)\n- Arsenal Strength\n- Rogue (barbells, racks, platforms)\n- FreeMotion cable systems\n\nPlus a dedicated posing room, dry sauna, and red light therapy. It's a serious training environment.", delay: 1200 },
            ],
            'Do you have personal trainers?': [
                { from: 'user', text: 'Do you have personal trainers?', delay: 0 },
                { from: 'bot', text: "Absolutely. Our coaches specialize in bodybuilding, powerlifting, contest prep, and custom programming. Featured trainers: Beni Magyar, Aroosha, Sarah Sweet, and Evana. Want me to connect you?", delay: 1200 },
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
            { from: 'bot', text: "Hey! You're interested in training — love to hear it. At Flex Fitness OC, coaching is what sets us apart.", delay: 800 },
            { from: 'bot', text: "Our trainers build fully custom programs based on your goals:\n\n- Bodybuilding & hypertrophy\n- Powerlifting & strength\n- Contest prep (men's & women's)\n- Booty building programs\n- General fitness & body recomp\n\nEvery plan includes coach check-ins to keep you on track.", delay: 1800 },
            { from: 'bot', text: "Our featured coaches:\n\nBeni Magyar — Bodybuilding specialist\nAroosha — Women's training & contest prep\nSarah Sweet — Strength & conditioning\nEvana — Custom programming", delay: 2800 },
            { from: 'bot', text: "Want me to connect you with one of them for a free intro consultation?", delay: 3600 },
        ],
        quickReplies: ['Yes, connect me!', 'What does training cost?', 'I want contest prep'],
        followUps: {
            'Yes, connect me!': [
                { from: 'user', text: 'Yes, connect me!', delay: 0 },
                { from: 'bot', text: "Let's do it! What's your first name and what are your main fitness goals? I'll pass it along to the coach who's the best fit for you and they'll reach out directly.", delay: 1200 },
            ],
            'What does training cost?': [
                { from: 'user', text: 'What does training cost?', delay: 0 },
                { from: 'bot', text: "Training packages are customized based on the coach and how many sessions per week you want. The best way to get an exact number is to come in for a free consultation — no pressure, just a conversation about your goals. Want me to book that?", delay: 1200 },
            ],
            'I want contest prep': [
                { from: 'user', text: 'I want contest prep', delay: 0 },
                { from: 'bot', text: "We've got you covered. Our coaches have prepped competitors for NPC, IFBB, and local shows. We handle training, nutrition, posing practice (we have a dedicated posing room), and peak week strategy. When's your show? Let's get you dialed in.", delay: 1200 },
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
            { from: 'bot', text: "Hey! Would love to show you around Flex Fitness OC. Seeing the space in person is the best way to understand what we're about.", delay: 800 },
            { from: 'bot', text: "We're at 23641 Ridge Route Dr, Suite B, Laguna Hills — easy to find, right off the 5.\n\nStaffed hours for tours:\nMon–Thu: 5 AM – 9 PM\nFri: 8 AM – 8 PM\nSat–Sun: 8 AM – 7 PM", delay: 1800 },
            { from: 'bot', text: "What day and time works best for you? Tony or one of our team will give you the full walkthrough — equipment floor, sauna, red light therapy room, everything.", delay: 2800 },
        ],
        quickReplies: ['This week', 'This weekend', 'What should I expect?'],
        followUps: {
            'This week': [
                { from: 'user', text: 'This week', delay: 0 },
                { from: 'bot', text: "Perfect! Any preferred day? Morning or evening? I'll get you on the schedule and send a confirmation. Also — we're running 100% off enrollment right now, so if you love what you see, you can lock that in same day.", delay: 1200 },
            ],
            'This weekend': [
                { from: 'user', text: 'This weekend', delay: 0 },
                { from: 'bot', text: "Weekends are great — we're staffed Sat–Sun 8 AM – 7 PM. Saturday morning tends to have the best energy in the gym. Want me to pencil you in? And don't forget — 100% off enrollment is happening now.", delay: 1200 },
            ],
            'What should I expect?': [
                { from: 'user', text: 'What should I expect?', delay: 0 },
                { from: 'bot', text: "A full walkthrough of the gym floor — you'll see our Panatta, Arsenal, and Rogue equipment. We'll show you the dry sauna, red light therapy room, posing room, and showers. No hard sell — just a real look at the space. Most people sign up on the spot because the vibe speaks for itself. When can you come by?", delay: 1200 },
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
            { from: 'bot', text: "Hey! Here are our hours at Flex Fitness OC:", delay: 800 },
            { from: 'bot', text: "Staffed Hours:\nMon–Thu: 5:00 AM – 9:00 PM\nFri: 8:00 AM – 8:00 PM\nSat–Sun: 8:00 AM – 7:00 PM\n\n24/7 members can access the gym anytime with their key fob — even holidays.", delay: 1600 },
            { from: 'bot', text: "We're at 23641 Ridge Route Dr, Suite B, Laguna Hills — right off the 5 freeway. Want to come check it out?", delay: 2400 },
        ],
        quickReplies: ['Book a tour', 'Membership pricing', 'What equipment do you have?'],
        followUps: {
            'Book a tour': [
                { from: 'user', text: 'Book a tour', delay: 0 },
                { from: 'bot', text: "Let's do it! What day and time works for you? Tony or our staff will show you around personally. And heads up — we're running 100% off enrollment right now.", delay: 1200 },
            ],
            'Membership pricing': [
                { from: 'user', text: 'Membership pricing', delay: 0 },
                { from: 'bot', text: "24/7 Access — $120/mo | Staffed Hours — $84.95/mo\n\nWe're currently offering 100% off enrollment (normally $170–$184). Want to lock that in with a tour?", delay: 1200 },
            ],
            'What equipment do you have?': [
                { from: 'user', text: 'What equipment do you have?', delay: 0 },
                { from: 'bot', text: "Top-tier brands: Panatta (Italian-made), Arsenal Strength, Rogue, FreeMotion. Plus a dedicated posing room, dry hot sauna, and LightStim red light therapy. Come see it in person — it hits different.", delay: 1200 },
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
            { from: 'bot', text: "Hey! Great question — recovery is a big part of what we offer at Flex Fitness OC.", delay: 800 },
            { from: 'bot', text: "We have a dry hot sauna available to all members — perfect for post-workout recovery, muscle relaxation, and detox.\n\nWe also offer LightStim Red Light Therapy sessions that support circulation, recovery, and skin health.", delay: 1800 },
            { from: 'bot', text: "Both are included with your membership — no extra fees. Want to come check out the facilities?", delay: 2600 },
        ],
        quickReplies: ['Book a tour', 'Membership pricing', 'What else do you offer?'],
        followUps: {
            'Book a tour': [
                { from: 'user', text: 'Book a tour', delay: 0 },
                { from: 'bot', text: "We'd love to have you! What day works? We're staffed Mon–Thu 5AM–9PM, Fri 8AM–8PM, Sat–Sun 8AM–7PM. We'll show you the full facility including the sauna and red light room.", delay: 1200 },
            ],
            'Membership pricing': [
                { from: 'user', text: 'Membership pricing', delay: 0 },
                { from: 'bot', text: "24/7 Access — $120/mo | Staffed Hours — $84.95/mo. Both include sauna and recovery amenities. Plus, we're running 100% off enrollment right now.", delay: 1200 },
            ],
            'What else do you offer?': [
                { from: 'user', text: 'What else do you offer?', delay: 0 },
                { from: 'bot', text: "Beyond the sauna and red light therapy:\n\n- Elite equipment floor (Panatta, Arsenal, Rogue)\n- Personal training & custom programming\n- Contest prep coaching\n- Posing room\n- Elemental Fit Meals (chef-made, ready to eat)\n- 24/7 access\n\nIt's a full training ecosystem. Come see it for yourself!", delay: 1200 },
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
            { from: 'bot', text: "Hey! Nutrition is half the battle — glad you're thinking about it.", delay: 800 },
            { from: 'bot', text: "We partner with Elemental Fit Meals — chef-made, macro-friendly meals ready to eat. No cooking, no guesswork. They're available right here at the gym.\n\nOur coaches also offer full nutrition guidance as part of training packages.", delay: 1800 },
            { from: 'bot', text: "Whether you're prepping for a show, cutting, bulking, or just eating cleaner — we can help you dial it in. Want to learn more about our training + nutrition packages?", delay: 2800 },
        ],
        quickReplies: ['Tell me about training', 'Membership pricing', 'Book a tour'],
        followUps: {
            'Tell me about training': [
                { from: 'user', text: 'Tell me about training', delay: 0 },
                { from: 'bot', text: "Our coaches build custom programs based on your goals: bodybuilding, powerlifting, contest prep, body recomp — you name it. Training packages include nutrition guidance so everything works together. Want a free consultation with one of our coaches?", delay: 1200 },
            ],
            'Membership pricing': [
                { from: 'user', text: 'Membership pricing', delay: 0 },
                { from: 'bot', text: "24/7 Access — $120/mo | Staffed Hours — $84.95/mo. Currently 100% off enrollment. Meal plans and training are separate but we can bundle everything. Come in for a tour and we'll put together a plan that fits your goals and budget.", delay: 1200 },
            ],
            'Book a tour': [
                { from: 'user', text: 'Book a tour', delay: 0 },
                { from: 'bot', text: "Let's get you in! We're at 23641 Ridge Route Dr, Suite B, Laguna Hills. Staffed Mon–Thu 5AM–9PM, Fri 8AM–8PM, Sat–Sun 8AM–7PM. What day works for you?", delay: 1200 },
            ],
        },
    },
};

// --- UTILITIES ---

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function updateStats() {
    document.getElementById('stat-detected').textContent = stats.detected;
    document.getElementById('stat-dms').textContent = stats.dms;
    document.getElementById('stat-leads').textContent = stats.leads;
}

function scrollToBottom(el) {
    if (el) el.scrollTop = el.scrollHeight;
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
    const initial = username.charAt(0).toUpperCase();

    const div = document.createElement('div');
    div.className = 'ig-comment' + (isUser ? ' user-comment' : '');
    div.innerHTML = `
        <div class="ig-comment-avatar">${initial}</div>
        <div class="ig-comment-body">
            <span><strong>${username}</strong> ${escapeHtml(text)}</span>
            <div class="ig-comment-meta">now</div>
        </div>
        <svg class="ig-comment-heart" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#737373" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
    `;
    section.appendChild(div);

    // Update comment count
    const label = document.getElementById('view-comments-label');
    const count = section.querySelectorAll('.ig-comment').length;
    label.textContent = `View all ${46 + count} comments`;

    const postScroll = section.closest('.ig-post-scroll');
    scrollToBottom(postScroll);

    // Check for keyword match
    const keyword = text.toUpperCase().trim();
    if (KEYWORD_FLOWS[keyword]) {
        processing = true;
        setTimeout(() => {
            div.classList.add('keyword-detected');
        }, 400);
        triggerAgent(keyword);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// --- AGENT ---

async function triggerAgent(keyword) {
    const flow = KEYWORD_FLOWS[keyword];
    const log = document.getElementById('agent-log');
    log.innerHTML = '';

    for (let i = 0; i < flow.agentSteps.length; i++) {
        const step = flow.agentSteps[i];
        await sleep(600 + i * 200);

        const entry = document.createElement('div');
        entry.className = `agent-entry ${step.type}`;
        entry.innerHTML = `<div class="agent-dot"></div><span>${step.text}</span>`;
        log.appendChild(entry);
        scrollToBottom(log);

        if (step.type === 'detect') { stats.detected++; updateStats(); }
        if (step.type === 'success') { stats.dms++; stats.leads++; updateStats(); }
    }

    await sleep(400);
    startDMConversation(keyword);
}

// --- DM CONVERSATION ---

async function startDMConversation(keyword) {
    const flow = KEYWORD_FLOWS[keyword];
    const container = document.getElementById('dm-container');

    container.innerHTML = `
        <div class="dm-thread">
            <div class="dm-thread-header">
                <svg class="dm-back" viewBox="0 0 24 24" width="24" height="24" fill="#f5f5f5"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
                <div class="dm-header-avatar">
                    <div class="dm-header-avatar-inner">FF</div>
                </div>
                <div class="dm-header-info">
                    <div class="dm-header-name">
                        flexfitnessoc
                        <svg viewBox="0 0 40 40" width="12" height="12"><circle cx="20" cy="20" r="20" fill="#0095F6"/><path d="M17.2 29.2l-7-7 2.8-2.8 4.2 4.2 9.8-9.8 2.8 2.8z" fill="#fff"/></svg>
                    </div>
                    <div class="dm-header-status">Active now</div>
                </div>
                <div class="dm-header-actions">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#f5f5f5" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#f5f5f5" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
            </div>
            <div class="dm-profile-card">
                <div class="dm-profile-avatar">FF</div>
                <div class="dm-profile-name">
                    Flex Fitness OC
                    <svg viewBox="0 0 40 40" width="12" height="12"><circle cx="20" cy="20" r="20" fill="#0095F6"/><path d="M17.2 29.2l-7-7 2.8-2.8 4.2 4.2 9.8-9.8 2.8 2.8z" fill="#fff"/></svg>
                </div>
                <div class="dm-profile-handle">flexfitnessoc</div>
                <div class="dm-profile-followers">12.4K followers</div>
                <button class="dm-profile-btn">View Profile</button>
            </div>
            <div class="dm-messages" id="dm-messages"></div>
            <div class="dm-quick-replies" id="dm-quick-replies" style="display:none;"></div>
            <div class="dm-input-bar">
                <input class="dm-input-field" type="text" placeholder="Message..." disabled>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#737373" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            </div>
        </div>
    `;

    const messagesEl = document.getElementById('dm-messages');

    for (const msg of flow.messages) {
        await sleep(msg.delay);
        if (msg.from === 'bot') {
            const typing = document.createElement('div');
            typing.className = 'dm-typing';
            typing.innerHTML = '<span></span><span></span><span></span>';
            messagesEl.appendChild(typing);
            scrollToBottom(messagesEl);
            await sleep(700 + Math.random() * 500);
            typing.remove();
        }

        const msgEl = document.createElement('div');
        msgEl.className = `dm-msg ${msg.from}`;
        msgEl.textContent = msg.text;
        messagesEl.appendChild(msgEl);
        scrollToBottom(messagesEl);
    }

    await sleep(500);
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

    const repliesEl = document.getElementById('dm-quick-replies');
    repliesEl.style.display = 'none';

    const messagesEl = document.getElementById('dm-messages');

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
            await sleep(700 + Math.random() * 400);
            typing.remove();
        }

        const msgEl = document.createElement('div');
        msgEl.className = `dm-msg ${msg.from}`;
        msgEl.textContent = msg.text;
        messagesEl.appendChild(msgEl);
        scrollToBottom(messagesEl);
    }

    const successEntry = document.createElement('div');
    successEntry.className = 'agent-entry success';
    successEntry.innerHTML = `<div class="agent-dot"></div><span>Follow-up delivered — lead engaged</span>`;
    log.appendChild(successEntry);
    scrollToBottom(log);

    await sleep(400);
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

    document.getElementById('comments-section').innerHTML = `
        <div class="ig-comment">
            <div class="ig-comment-avatar">M</div>
            <div class="ig-comment-body">
                <span><strong>mike_lifts92</strong> This gym looks insane</span>
                <div class="ig-comment-meta">2h</div>
            </div>
            <svg class="ig-comment-heart" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#737373" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </div>
        <div class="ig-comment">
            <div class="ig-comment-avatar">S</div>
            <div class="ig-comment-body">
                <span><strong>sarah_fitjourney</strong> Best gym in OC hands down</span>
                <div class="ig-comment-meta">1h</div>
            </div>
            <svg class="ig-comment-heart" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#737373" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </div>
    `;

    document.getElementById('view-comments-label').textContent = 'View all 48 comments';

    document.getElementById('agent-log').innerHTML = `
        <div class="agent-entry idle">
            <div class="agent-dot"></div>
            <span>Monitoring @flexfitnessoc comments...</span>
        </div>
    `;

    document.getElementById('dm-container').innerHTML = `
        <div class="dm-empty">
            <div class="dm-empty-icon">
                <svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="#363636" stroke-width="1.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </div>
            <div class="dm-empty-title">Your Messages</div>
            <div class="dm-empty-sub">When a keyword is detected, the automated DM will appear here.</div>
        </div>
    `;
}

// --- INIT ---

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('comment-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); postComment(); }
    });
});
