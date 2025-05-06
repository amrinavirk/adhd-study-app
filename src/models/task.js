class Task {
    constructor(title, date, time, duration, category, subtasks = []) {
        this.id = is || Date.now();
        this.title = title || '';
        this.subtasks = subtasks || '';
        this.category = category || 'unscheduled';
        this.date = date || '';
        this.time = time || '';
        this.duration = duration || '';
        this.completed = completed || false;
        this.colour = this.setColour(category)
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
        return categoryColours[category] || 'defaultColor';
      }



    isOverdue() {
        const now = new Date();
        return this.dueDateTime < now && !this.completed;
    }

    markCompleted() {
        this.completed = true;
    }

    edit(details) {
        Object.assign(this, details);
    }
}