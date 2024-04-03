import { Component, Output, EventEmitter } from '@angular/core';
import { environment } from '../../../environments/environment';
import { GlobalErrorHandlerService } from 'src/app/public/services/globalErrorHandler/global-error-handler.service';

/**
 * Component for uploading images using Cloudinary.
 * This component provides functionality for uploading images to Cloudinary.
 */
@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css'],
})
export class ImageUploadComponent {
  // Cloudinary cloud name from environment configuration
  cloudName = environment.cloudinaryConfig.cloudName;
  // Cloudinary upload preset from environment configuration
  uploadPreset = environment.cloudinaryConfig.uploadPreset;
  // Cloudinary upload widget instance
  myWidget: any;

  // Output event emitter for emitted image URL
  @Output() imageUploaded = new EventEmitter<string>();

  /**
   * Constructor for ImageUploadComponent.
   * @param globalErrorHandler Service for handling global errors
   */
  constructor(private globalErrorHandler: GlobalErrorHandlerService) {}

  /**
   * Lifecycle hook called when the component is initialized.
   * Initializes Cloudinary upload widget.
   */
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
            this.globalErrorHandler.handleError(error);
          }
        }
      }
    );
  }

  /**
   * Handles image uploaded event.
   * Emits the uploaded image URL.
   * @param imageUrl The URL of the uploaded image
   */
  onImagesUploaded(imageUrl: string) {
    this.imageUploaded.emit(imageUrl);
  }

  /**
   * Opens Cloudinary upload widget.
   */
  openWidget() {
    this.myWidget.open();
  }
}
