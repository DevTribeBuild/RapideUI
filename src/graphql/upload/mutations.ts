import { gql } from "@apollo/client";

export const SINGLE_UPLOAD_MUTATION = gql`
   mutation SingleUpload($file: Upload!) {
     singleUpload(file: $file) {
       success
       message
       url
     }
   }
 `;

export const MULTIPLE_UPLOAD_MUTATION = gql`
   mutation MultipleUpload($files: [Upload!]!) {
     multipleUpload(files: $files) {
       success
       message
       url
     }
   }
 `;
