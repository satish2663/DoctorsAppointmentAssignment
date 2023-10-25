from flask import Flask, request, jsonify
from datetime import datetime, timedelta

app = Flask(__name__)

doctors = [
    {
        "id": 1,
        "name": "Dr. John Doe",
        "location": "Hospital A",
        "evenings": [
            {"day": "Monday", "start_time": "18:00", "end_time": "20:00"},
            {"day": "Wednesday", "start_time": "18:00", "end_time": "20:00"},
        ],
        "max_patients": 10,
        "appointments": [],
    },
    {
        "id": 2,
        "name": "Dr. Jane Smith",
        "location": "Hospital B",
        "evenings": [
            {"day": "Tuesday", "start_time": "18:00", "end_time": "20:00"},
            {"day": "Thursday", "start_time": "18:00", "end_time": "20:00"},
        ],
        "max_patients": 15,
        "appointments": [],
    },
]

@app.route("/doctors", methods=["GET"])
def get_doctors():
    return jsonify(doctors)

@app.route("/doctors/<int:doctor_id>", methods=["GET"])
def get_doctor_detail(doctor_id):
    doctor = next((doc for doc in doctors if doc["id"] == doctor_id), None)
    if doctor:
        return jsonify(doctor)
    else:
        return jsonify({"error": "Doctor not found"}), 404

@app.route("/doctors/<int:doctor_id>/appointments", methods=["POST"])
def book_appointment(doctor_id):
    doctor = next((doc for doc in doctors if doc["id"] == doctor_id), None)
    if not doctor:
        return jsonify({"error": "Doctor not found"}), 404

    appointment_date = request.form.get("appointment_date")
    appointment_time = request.form.get("appointment_time")

    if not appointment_date or not appointment_time:
        return jsonify({"error": "Appointment date and time are required"}), 400

    appointment_date = datetime.strptime(appointment_date, "%Y-%m-%d")
    appointment_time = datetime.strptime(appointment_time, "%H:%M")

    if appointment_date.weekday() % 2 == 0:
        return jsonify({"error": "Appointments can only be booked on evenings"}), 400

    for schedule in doctor["evenings"]:
        if schedule["day"] == appointment_date.strftime("%A"):
            start_time = datetime.strptime(schedule["start_time"], "%H:%M")
            end_time = datetime.strptime(schedule["end_time"], "%H:%M")

            if start_time <= appointment_time <= end_time:
                if len(doctor["appointments"]) >= doctor["max_patients"]:
                    return jsonify({"error": "Doctor's appointment limit has been reached"}), 400

                doctor["appointments"].append({
                    "appointment_date": appointment_date.strftime("%Y-%m-%"),
                    "appointment_time": appointment_time.strftime("%H:%M")
                })

                return jsonify({"message": "Appointment booked successfully"}), 201
            else:
                return jsonify({"error": "Appointment time is not available"}), 400

    return jsonify({"error": "Doctor is not available on this date"}), 400

if __name__ == "__main__":
    app.run(debug=True)