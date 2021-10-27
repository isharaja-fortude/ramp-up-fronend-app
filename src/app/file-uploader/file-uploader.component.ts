import { HttpClient } from '@angular/common/http';
import { Component, Inject, inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent implements OnInit {

  fileToUpload: File | null = null;
  fileName = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
  }

  onFileSelected(event: any) {
    const file:File = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      formData.append("file", file);
      const upload$ = this.http.post("http://localhost:3000/file-parser/upload", formData);
      upload$.subscribe();
      }
    }

}
