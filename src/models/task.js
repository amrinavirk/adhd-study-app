class Task {
    constructor(id, title, subtasks, category, date, time, duration, completed = false ) {
        this.id = id || Date.now();
        this.title = title || '';
        this.subtasks = subtasks || '';
        this.category = category || '';
        this.date = date || '';
        this.time = time || '';
        this.duration = duration || '';
        this.completed = completed || false;
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
        if (this.completed || !this.date || !this.time) return false;
        const dueDateTime = new Date(`${this.date}T${this.time}`);
        return currentDateTime > dueDateTime;
    }

    markCompleted() {
        this.completed = true;
    }

    edit(details) {
        Object.assign(this, details);
    }
}

export default Task;