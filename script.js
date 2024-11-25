import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDwG5hUssCcUYqFccfmch3A-JlymuqKc98",
    authDomain: "smart-parking-dc7a2.firebaseapp.com",
    databaseURL: "https://smart-parking-dc7a2-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "smart-parking-dc7a2",
    storageBucket: "smart-parking-dc7a2.appspot.com",
    messagingSenderId: "718643257527",
    appId: "1:718643257527:web:127a8bddfaff9961d96d32",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Fetch and display parking info

function fetchParkingInfo() {
    const parkingRef = ref(database, 'parking_spaces');
    onValue(parkingRef, (snapshot) => {
        const data = snapshot.val();
        const parkingInfoDiv = document.getElementById('parking-info');
        const totalSlotsDiv = document.getElementById('total-slots'); // เพิ่ม div สำหรับจำนวนช่องจอดทั้งหมด
        const availableSlotsDiv = document.getElementById('available-slots'); // ใช้ div ที่แก้ไข

        parkingInfoDiv.innerHTML = '';
        let availableCount = 0;
        let totalSlots = 0;

        if (data) {
            totalSlots = Object.keys(data).length; // นับจำนวนช่องจอดทั้งหมด

            Object.keys(data).forEach(slot => {
                const slotData = data[slot];
                const slotElement = document.createElement('div');
                slotElement.classList.add('parking-slot', slotData.status);

                // Add click event listener to display status history
                slotElement.onclick = () => displayStatusHistory(slot);

                // Populate the slot information
                slotElement.innerHTML = `ช่อง ${slot.replace(/\D/g, '')}`;
                parkingInfoDiv.appendChild(slotElement);

                // Count available slots
                if (slotData.status === 'available') {
                    availableCount++;
                }
            });

            // แสดงจำนวนช่องจอดทั้งหมดและช่องจอดว่างใน div ที่แยกออกมา
            totalSlotsDiv.innerHTML = `ช่องจอดทั้งหมด: ${totalSlots}`;
            availableSlotsDiv.innerHTML = `ช่องจอดว่าง: ${availableCount}`;
        } else {
            parkingInfoDiv.innerHTML = '<p>ไม่มีข้อมูลการใช้งานช่องจอด</p>';
            totalSlotsDiv.innerHTML = 'ช่องจอดทั้งหมด: 0';
            availableSlotsDiv.innerHTML = 'ช่องจอดว่าง: 0';
        }
    }, (error) => {
        console.error("Error fetching parking data: ", error);
    });
}





// Initial call to fetch parking status
fetchParkingInfo();
