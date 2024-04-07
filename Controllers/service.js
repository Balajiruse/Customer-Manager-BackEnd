
import { Service } from "../schema/service.js";
import { User } from "../schema/user.js";
import { getUser, getUserBySessionToken } from "./user.js";

// Create Service
export function createService(req) {
  return new Service({ serviceName: req.body.serviceName }).save();
}

// Delete Service
export function deleteService(req) {
  return Service.deleteOne({ _id: req.body.serviceId });
}

// Get Service with new user
export function getServiceCurr(req) {
  return Service.findOne({ _id: req.body._id }).populate("currentUser");
}

// Get Service with old user
export function getServiceOld(req) {
  return Service.findOne({ _id: req.body._id }).populate("oldUser");
}

// Get All Service
export function getAllServices() {
  return Service.find();
}

// Changing Services for Users
export async function changeServices(req) {
  try {
    // Get user data
    const user = await getUserBySessionToken(req);
    if (!user) return { error: "Data not found", acknowledged: false };

    // Remove user data from old services if the user have any prior service
    if (user.services || user.services.length > 0) {
      for (let val of user.services) {
        const ser = await Service.findOne({ _id: val });
        if (!ser) return { error: "Data not found", acknowledged: false };

        // add user data to Old user array if it's already exist
        if (
          !ser.oldUser.includes(user._id) &&
          ser.oldUser &&
          ser.oldUser.length > 0
        ) {
          ser.oldUser = [...new Set([...ser.oldUser, user._id])];
        } else if (!ser.oldUser || ser.oldUser.length < 1) {
          ser.oldUser = [user._id];
        }

        // remove user data from Current User Array if it's exist
        if (ser.currentUser.length > 0) {
          ser.currentUser = ser.currentUser.filter((curr) => {
            return curr.toString() !== user._id.toString();
          });
          ser.currentUser = [...new Set(ser.currentUser)];
        }

        // saving service
        await ser.save();
      }
    }

    // Add user to the new services which is in req body if there is any req made
    if (req.body.services.length > 0) {
      for (let val of req.body.services) {
        const newSer = await Service.findOne({ _id: val });
        if (!newSer) return { error: "Data not found", acknowledged: false };

        // remove user data from oldUser Array from SERVICES
        if (
          newSer.oldUser.includes(user._id) &&
          newSer.oldUser.length > 0 &&
          newSer.oldUser
        ) {
          newSer.oldUser = newSer.oldUser.filter((old) => {
            return old !== user._id;
          });
        }

        // add user data to current user array
        if (!newSer.currentUser.includes(user._id) && newSer.currentUser) {
          newSer.currentUser = [...new Set([...newSer.currentUser, user._id])];
        } else if (!newSer.currentUser) {
          newSer.currentUser = [user._id];
        }

        // saving service
        await newSer.save();
      }
    }

    // adding the service to the user database
    user.services = [...new Set([...req.body.services])];

    // saving User data
    await user.save();

    return {
      message: "Service changed Successfully",
      acknowledged: true,
      data: user.services,
    };
  } catch (err) {
    console.log(err);
  }
}
