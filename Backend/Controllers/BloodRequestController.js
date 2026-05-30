const BloodRequest = require('../Models/BloodRequest');
const User = require('../Models/RegistrationSchema');
const Notification = require('../Models/Notification');
const { publishBloodRequest } = require('../Config/realtime');
const webpush = require('../Config/webpush');

const createRequest = async (req, res) => {
    try {
        const { bloodGroupRequired, priority, unitsRequired, coordinates } = req.body; // coordinates: [lng, lat]

        if (!bloodGroupRequired || !coordinates) {
            return res.status(400).json({ message: 'Blood group and location are required.' });
        }

        const newRequest = new BloodRequest({
            patientId: req.user._id,
            bloodGroupRequired,
            priority,
            unitsRequired,
            location: {
                type: 'Point',
                coordinates
            }
        });

        await newRequest.save();

        // Broadcast to redis if urgent or high
        if (priority === 'urgent' || priority === 'high') {
            const broadcastPayload = {
                id: newRequest._id,
                bloodGroupRequired,
                priority,
                coordinates,
                message: `URGENT: ${unitsRequired} units of ${bloodGroupRequired} blood required nearby!`
            };
            publishBloodRequest(broadcastPayload);
            
            // Web-Push to Nearby Compatible Donors
            const nearbyDonors = await User.find({
                'patientProfile.isAvailableToDonate': true,
                'patientProfile.bloodType': bloodGroupRequired, // Needs refined compatibility logic in production
                location: {
                    $nearSphere: {
                        $geometry: { type: 'Point', coordinates },
                        $maxDistance: 50000 // 50km
                    }
                }
            });

            const pushPayload = JSON.stringify({
                title: 'Urgent Blood Request',
                body: broadcastPayload.message,
                icon: '/icon.png', // Assuming frontend has this icon
                data: { url: `/requests/${newRequest._id}` }
            });

            nearbyDonors.forEach(donor => {
                if (donor.pushSubscriptions && donor.pushSubscriptions.length > 0) {
                    donor.pushSubscriptions.forEach(sub => {
                        webpush.sendNotification(sub, pushPayload).catch(err => {
                            console.error('Web Push Error:', err.message);
                            // Optional: Remove stale subscription if statusCode === 410 (Gone)
                        });
                    });
                }
            });
        }

        res.status(201).json({
            status: 'success',
            data: newRequest
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating blood request', error: error.message });
    }
};

const getNearbyRequests = async (req, res) => {
    try {
        const { lng, lat, distance = 50000 } = req.query; // default 50km

        if (!lng || !lat) {
            return res.status(400).json({ message: 'Longitude and latitude are required.' });
        }

        const requests = await BloodRequest.find({
            location: {
                $nearSphere: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: parseInt(distance)
                }
            },
            status: 'pending'
        }).populate('patientId', 'name phone');

        res.status(200).json({ status: 'success', data: requests });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching requests', error: error.message });
    }
};

const getNearbyDonors = async (req, res) => {
    try {
        const { lng, lat, distance = 50000, bloodType } = req.query;

        if (!lng || !lat) {
            return res.status(400).json({ message: 'Longitude and latitude are required.' });
        }

        const query = {
            'patientProfile.isAvailableToDonate': true,
            location: {
                $nearSphere: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: parseInt(distance)
                }
            }
        };

        if (bloodType) {
            query['patientProfile.bloodType'] = bloodType;
        }

        const donors = await User.find(query).select('name phone patientProfile location');

        res.status(200).json({ status: 'success', data: donors });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching donors', error: error.message });
    }
};

module.exports = { createRequest, getNearbyRequests, getNearbyDonors };
