import { useState, useEffect, useCallback } from 'react';

const dbName = 'BrainDumpDB';
const storeName = 'notesStore';

const BrainDumpPage = () => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState({ title: '', body: '' });
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [editingContent, setEditingContent] = useState({ title: '', body: '' });



    // open or create new IndexedDB db
    const openDB = useCallback(() => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, 1);

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = () => {
                reject('error');
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
                }
            };
        });
    }, []);

    // fetch notes from the db
    const loadNotes = useCallback(async () => {
        const db = await openDB();
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = (event) => {
            setNotes(event.target.result);
        };

        request.onerror = () => {
            console.error('error');
        };
    }, [openDB]);

    // load notes when component is mounted
    useEffect(() => {
        loadNotes();
    }, [loadNotes]);


    // updates live changes to forms
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewNote({ ...newNote, [name]: value });
    };

    // add note frontend
    const handleAddNote = () => {
        if (newNote.title && newNote.body) {
            const noteWithId = {
                id: Date.now(),
                ...newNote
            };
            addNoteToDB(noteWithId);
            setNotes([...notes, noteWithId]);
            setNewNote({ title: '', body: '' });
        }
    };

    //save note frontend
    const handleSaveNote = async (id) => {
        const updatedNote = { id, ...editingContent };
        await updateNoteInDB(updatedNote);
        setEditingNoteId(null);
        setEditingContent({ title: '', body: '' });
    };



    //delete note frontend
    const handleDeleteNote = (index) => {
        deleteNoteFromDB(index);
    };


    //cancel adding/editing and clear forms
    const handleCancel = () => {
        setNewNote({ title: '', body: '' });
        setEditingIndex(null);
    };

    //add note backend
    const addNoteToDB = async (note) => {
        const db = await openDB();
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.add(note);

        request.onsuccess = () => {
            loadNotes();
        };

        request.onerror = () => {
            console.error('error');
        };
    };

    //edit note backend
    const updateNoteInDB = async (updatedNote) => {
        const db = await openDB();
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(updatedNote);

        request.onsuccess = () => {
            loadNotes();
        };

        request.onerror = () => {
            console.error('error');
        };
    };


    //delete note backend
    const deleteNoteFromDB = async (index) => {
        const db = await openDB();
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(index);

        request.onsuccess = () => {
            loadNotes();
        };

        request.onerror = () => {
            console.error('error');
        };
    };

    return (
        <div>
            {/* new note section */}
            <div>
                <input
                    type="text"
                    name="title"
                    value={newNote.title}
                    onChange={handleChange}
                    placeholder="Title"
                />
                <textarea
                    name="body"
                    value={newNote.body}
                    onChange={handleChange}
                    placeholder="Body of the note"
                ></textarea>
                <button onClick={editingIndex === null ? handleAddNote : handleSaveNote}>
                    {editingIndex === null ? 'ADD NOTE' : 'SAVE NOTE'}
                </button>
                <button onClick={handleCancel}>CANCEL</button> { }
            </div>

            {/* main notes section */}
            <div>
                <h2>NOTES</h2>
                <div className="scrollcontainer">
                    {notes.map((note) => (
                        <div key={note.id}>
                            {editingNoteId === note.id ? (
                                <>
                                    <input
                                        type="text"
                                        name="title"
                                        value={editingContent.title}
                                        onChange={(e) =>
                                            setEditingContent({ ...editingContent, title: e.target.value })
                                        }
                                    />
                                    <textarea
                                        name="body"
                                        value={editingContent.body}
                                        onChange={(e) =>
                                            setEditingContent({ ...editingContent, body: e.target.value })
                                        }
                                    />
                                    <button onClick={() => handleSaveNote(note.id)}>SAVE</button>
                                    <button onClick={() => setEditingNoteId(null)}>CANCEL</button>
                                </>
                            ) : (
                                <>
                                    <h3>{note.title}</h3>
                                    <p>{note.body}</p>
                                    <button
                                        onClick={() => {
                                            setEditingNoteId(note.id);
                                            setEditingContent({ title: note.title, body: note.body });
                                        }}
                                    >
                                        EDIT
                                    </button>
                                    <button onClick={() => handleDeleteNote(note.id)}>DELETE</button>
                                </>
                            )}
                        </div>
                    ))}

                </div>
            </div>
            {/* mascot and speech bubble section */}
            <div>
                {/* insert mascot/animation */}
                <sub>Don't forget to address and delete old notes to declutter!</sub>
            </div>
        </div>
    );
}

export default BrainDumpPage;