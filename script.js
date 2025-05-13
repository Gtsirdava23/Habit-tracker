// Habit data
let habits = JSON.parse(localStorage.getItem('habits')) || [];

// Image from CDN
const HABIT_CATEGORIES = {
alcohol: {
name: 'Alcohol',
icon: 'https://cdn-icons-png.flaticon.com/512/3174/3174828.png',
avatar: 'https://cdn-icons-png.flaticon.com/512/3174/3174830.png'
},
smoking: {
name: 'Smoking',
icon: 'https://cdn-icons-png.flaticon.com/512/188/188333.png',
avatar: 'https://cdn-icons-png.flaticon.com/512/188/188333.png'
},
gaming: {
name: 'Video Games',
icon: 'https://cdn-icons-png.flaticon.com/512/3612/3612569.png', 
avatar: 'https://cdn-icons-png.flaticon.com/512/3612/3612569.png' 
}, 
custom: { 
name: 'My habit', 
icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828843.png', 
avatar: 'https://cdn-icons-png.flaticon.com/512/1828/1828843.png' 
}
};

// DOM elements
const habitsList = document.getElementById('habits-list');
const newHabitInput = document.getElementById('new-habit');
const habitCategorySelect = document.getElementById('habit-category');
const addHabitBtn = document.getElementById('add-habit-btn');

// Hide the input field for standard habits
function toggleInputVisibility() {
newHabitInput.style.display = habitCategorySelect.value === 'custom' ? 'block' : 'none';
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
toggleInputVisibility();
habitCategorySelect.addEventListener('change', toggleInputVisibility);
renderHabits();

// Update timers every second
setInterval(updateTimers, 1000);
});

// Add a new habit
addHabitBtn.addEventListener('click', addHabit);

function addHabit() {
const category = habitCategorySelect.value;
let name;

if (category === 'custom') {
name = newHabitInput.value.trim();

if (!name) {
alert('Please enter a habit name');
return;
}
} else {
name = HABIT_CATEGORIES[category].name;
}

// Check if such a habit already exists
if (habits.some(h => h.name === name)) {
alert('This habit has already been added!');
return;
}

const habit = {
id: Date.now(),
name,
category,
startDate: new Date().toISOString(),
lastReset: new Date().toISOString()
};

habits.push(habit);
saveHabits();
renderHabits();
newHabitInput.value = '';
}

// Delete a habit
function deleteHabit(id) {
if (confirm('Are you sure you want to delete this habit?')) {
habits = habits.filter(habit => habit.id !== id);
saveHabits();
renderHabits();
}
}

// Reset the habit timer
function resetHabit(id) {
const habit = habits.find(h => h.id === id);
if (habit) {
habit.lastReset = new Date().toISOString();
saveHabits();
renderHabits();
alert('Timer reset! Starting the countdown again.');
}
}

// Display the habit list
function renderHabits() {
habitsList.innerHTML = habits.length ? '' : '<p>No habits added yet</p>';

habits.forEach(habit => { 
const habitCard = document.createElement('div'); 
habitCard.className = 'habit-card'; 

const categoryData = HABIT_CATEGORIES[habit.category]; 
const timePassed = calculateTimePassed(habit.lastReset); 

habitCard.innerHTML = ` 
<span class="delete-btn" onclick="deleteHabit(${habit.id})"> 
<i class="fas fa-trash"></i> 
</span> 
<img src="${categoryData.icon}" alt="${habit.name}" class="habit-icon"> 
<h2>${habit.name}</h2> 
<div class="timer" id="timer-${habit.id}">${formatTimePassed(timePassed)}</div> 
<button class="reset-btn" onclick="resetHabit(${habit.id})"> 
<i class="fas fa-redo"></i> Reset timer
</button>
`;

habitsList.appendChild(habitCard);
});
}

// Update timers
function updateTimers() {
habits.forEach(habit => {
const timerElement = document.getElementById(`timer-${habit.id}`);
if (timerElement) {
const timePassed = calculateTimePassed(habit.lastReset);
timerElement.textContent = formatTimePassed(timePassed);
}
});
}

// Calculate elapsed time
function calculateTimePassed(lastResetDate) {
const lastReset = new Date(lastResetDate);
const now = new Date();
const diff = now - lastReset;

return { 
days: Math.floor(diff / (1000 * 60 * 60 * 24)), 
hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)), 
minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)), 
seconds: Math.floor((diff % (1000 * 60)) / 1000) 
};
}

// Time formatting
function formatTimePassed(time) { 
if (time.days > 0) return `${time.days} d ${time.hours} h ${time.minutes} min`; 
if (time.hours > 0) return `${time.hours} h ${time.minutes} min ${time.seconds} sec`; 
if (time.minutes > 0) return `${time.minutes} min ${time.seconds} sec`;
return `${time.seconds} sec`;
}

// Save data
function saveHabits() {
localStorage.setItem('habits', JSON.stringify(habits));
}