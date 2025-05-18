class Task {
    constructor(id, title, subtasks, category, date, time, duration, completed = false, completedAt = null) {
        this.id = id || Date.now();
        this.title = title || '';
        this.subtasks = subtasks || '';
        this.category = category || '';
        this.date = date || '';
        this.time = time || '';
        this.duration = duration || '';
        this.completed = completed || false;
        this.completedAt = '';
        this.colour = this.setColour(this.category)
    }

    updateCategory(newCategory) {
        this.category = newCategory;
        this.colour = this.setColour(newCategory);
        if (newCategory === 'unscheduled') {
            this.date = null;
            this.time = null;
            this.duration = 0;
        }
    }

    setColour(category) {
        const categoryColours = {
            category1: '#F7DDF0', //pink
            category2: '#FFD7B7', //orange
            category3: '#FFFAB9', //yellow
            category4: '#CEFFD2', //green
            category5: '#AFCAFF', //blue
            category6: '#D5D5FF', //purple
            unscheduled: '#EAE5F4' //grey
        };
        return categoryColours[category] || '';
    }



    isOverdue(currentDateTime = new Date()) {
        if (this.completed || !this.date || !this.time || !this.duration) return false;
        const start = new Date(`${this.date}T${this.time}`);
        const durationMinutes = parseFloat(this.duration) * 60;
        const dueDateTime = new Date(start.getTime() + durationMinutes * 60000);
        return currentDateTime > dueDateTime;
    }

    markCompleted() {
        this.completed = true;
        this.completedAt = new Date().toLocaleDateString('en-CA')
    }

    edit(details) {
        Object.assign(this, details);
    }
}

export default Task;