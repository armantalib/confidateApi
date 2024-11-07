const { default: axios } = require("axios");
const Notification = require("../models/Notification");

const FCM_SERVER_KEY = 'AAAA-8KENFM:APA91bF8QwXhnLUtG2FSxYCS_3fMTYx-uZoiBy5TDmqePcGcOCNFpeYmDM85GzwZU29IxroO2y4PkthenbWFoVwPq8TVo6H13XSaunrhRyHh7OpEZ1UFbHO8KOwHGKrqjkMGowDe8ovb';

exports.sendNotification = async ({
     user = '',
     to_id = '',
     description = '',
     type = '',
     title = '',
     fcmtoken = '',
     gig='',
     request='',
     order='',
     noti=false
}) => {
     try {

          // Create an object to store the fields to be updated
  const updateFields = Object.fromEntries(
     Object.entries({
          user,
          to_id,
          type,
          description,
          title,
          gig,
          request,
          order,     
     }).filter(([key, value]) => value !== "")
   );
 
          const notification = new Notification(updateFields);

          const message = {
               to: fcmtoken,
               notification: {
                    title: title,
                    body: description
               }
          };

          await notification.save();
          console.log( fcmtoken)
          if (noti&&fcmtoken) {
               const res = await axios.post('https://fcm.googleapis.com/fcm/send', message, {
                    headers: {
                         'Authorization': `key=${FCM_SERVER_KEY}`,
                         'Content-Type': 'application/json'
                    }
               })
               console.log(res.data)

          }
     } catch (error) {
          throw new Error(error)
     }
}

