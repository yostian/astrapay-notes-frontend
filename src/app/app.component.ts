import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Note } from './model/notemodel';
import { NoteService } from './service/noteservice';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, FormsModule]
})
export class AppComponent implements OnInit {
  notes: Note[] = [];
  newNoteTitle: string = '';
  newNoteContent: string = '';

  constructor(private noteService: NoteService) {}

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes(): void {
    this.noteService.getNotes().subscribe({
      next: (data) => {
        this.notes = data;
      },
      error: (err) => {
        console.error('Gagal mengambil data:', err);
        alert('Gagal terhubung ke server. Pastikan backend sudah dijalankan.');
      }
    });
  }

  addNote(): void {
    const title = this.newNoteTitle.trim();
    const content = this.newNoteContent.trim();
    if (!title || !content) {
      alert('Judul dan isi catatan wajib diisi!');
      return;
    }

    const newNote = { title, content };
    this.noteService.addNote(newNote).subscribe({
      next: (note) => {
        this.notes.push(note);
        this.newNoteTitle = '';
        this.newNoteContent = '';
      },
      error: (err) => {
        console.error('Gagal menambahkan catatan:', err);
        alert('Tidak dapat menambahkan catatan. Server tidak merespons.');
      }
    });
  }

  deleteNote(id: number): void {
    this.noteService.deleteNote(id).subscribe({
      next: () => {
        this.notes = this.notes.filter(note => note.id !== id);
      },
      error: (err) => {
        console.error('Gagal menghapus catatan:', err);
        alert('Tidak dapat menghapus catatan. Server tidak merespons.');
      }
    });
  }
}
