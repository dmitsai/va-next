import { z } from "zod";
import { httpClient } from "~/shared/api/client";
import {  clientProcedure, createTRPCRouter } from "../trpc";

function mapFormDataToUploadThingPayload(formData: FormData) {
    const file = formData.get('file')
  
    if (!file) {
      throw new Error('No file found in FormData');
    }
  
    const payload = {
      files: [
        {
          name: file.name,         
          size: file.size,          
          type: file.type,          
          customId: null            
        }
      ],
      acl: 'public-read',           
      metadata: null,               
      contentDisposition: 'inline'  
    };
  
    return payload;
  }

export const fileUploadRouter = createTRPCRouter({

    uploadResume: clientProcedure
    .input(z.instanceof(FormData))
    .mutation(async({ctx, input}) => {

        const data = input;

        const payload = mapFormDataToUploadThingPayload(input);

        console.log('file',data)

        try {
            const response = await httpClient.post('https://api.uploadthing.com/v6/uploadFiles', 
                payload,
              {
                headers: {
                  'X-Uploadthing-Api-Key': 'sk_live_7ed2641451daafdfcd69a02aab95dc0f6e8013427f2b5bfdc2d719f084f50f18'
                },
                
              })
            console.log('response from upload',response.data.data[0].fields)
            // console.log('response from upload',response.data.data[0].fields)
            // console.log('token',response.data.data[0].fields['X-Amz-Security-Token'])
            // console.log('url', response.data.data[0].url)

            const url = response.data.data[0].pollingUrl;

            const linkresponse = await httpClient.put(url,{
            input
            },
            {    
                headers: {
                'X-Uploadthing-Api-Key': 'sk_live_7ed2641451daafdfcd69a02aab95dc0f6e8013427f2b5bfdc2d719f084f50f18',

              },
            }
    );
          } catch (error) {
            console.error("Upload error:", error);
            throw error;
          }

    })
});