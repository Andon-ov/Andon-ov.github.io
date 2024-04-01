import { Component, Output, EventEmitter } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css'],
})
export class ImageUploadComponent {
  cloudName = environment.cloudinaryConfig.cloudName;

  uploadPreset = environment.cloudinaryConfig.uploadPreset;
  myWidget: any;

  @Output() imageUploaded = new EventEmitter<string>();

  ngOnInit() {
    //@ts-ignore
    this.myWidget = cloudinary.createUploadWidget(
      {
        cloudName: this.cloudName,
        uploadPreset: this.uploadPreset,
        // cropping: true, //add a cropping step
        // showAdvancedOptions: true,  //add advanced options (public_id and tag)
        // sources: [ "local", "url"], // restrict the upload sources to URL and local files
        // multiple: false,  //restrict upload to a single file
        // folder: "user_images", //upload files to the specified folder
        // tags: ["users", "profile"], //add the given tags to the uploaded files
        // context: {alt: "user_uploaded"}, //add the given context data to the uploaded files
        // clientAllowedFormats: ["images"], //restrict uploading to image files only
        // maxImageFileSize: 2000000,  //restrict file size to less than 2MB
        maxImageWidth: 500, //Scales the image down to a width of 2000 pixels before uploading
        theme: 'purple', //change to a purple theme
      },
      (
        error: Error,
        result: { event: string; info: { secure_url: string } }
      ) => {
        if (!error && result && result.event === 'success') {
          try {
            console.log('Done! Here is the image info: ', result.info);
            this.onImagesUploaded(result.info.secure_url);
          } catch (error) {
            console.error(
              'An error occurred while uploading the image:',
              error
            );
          }
        }
      }
    );
  }

  onImagesUploaded(imageUrl: string) {
    this.imageUploaded.emit(imageUrl);
  }

  openWidget() {
    this.myWidget.open();
  }
}
