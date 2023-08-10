import React, { useRef, useContext } from 'react';
import { HolidaysContext } from '../../context/HolidaysContext'
import emailjs from '@emailjs/browser';
import moment from 'moment';
import { AuthContext } from '../../context/AuthContext'

const HolidayEmail = () => {
    const form = useRef();
    const { holidaysData } = useContext(HolidaysContext)
    const { userData } = useContext(AuthContext)
    console.log(userData)
    //sending email to all  users
    const sendEmail = (e) => {
        e.preventDefault();
        console.log(e.target.email)
        emailjs.sendForm('service_2jm8iue', 'template_jcs0gvd', e.target, '7E1QUrPpZ_ri8eIqo')
            .then((result) => {
                console.log(result);
            }, (error) => {
                console.log(error.text);
            });
    };


    //get the next day
    const nextdate = moment(new Date(new Date().getTime() + 24 * 60 * 60 * 1000)).format("YYYY-MM-DD")
    // const nextdate = "2023-08-10"
    const formatdate = moment(nextdate).format("DD-MM-YYYY")
    console.log("format-date", formatdate)
    const isHoliday = (date) => {

        return holidaysData.some((holiday) => holiday.date === date);
    };
    const isBirthday = (date) => {
        console.log(userData.dob)
        return userData.dob.slice(5, 10) === date.slice(5, 10)
    };

    const getOccasion = (date) => {
        const holiday = holidaysData.find((holiday) => holiday.date === date);
        return holiday ? holiday.name : '';
    };
    console.log(isBirthday(nextdate))
    console.log(form.current)
    const sendAdminEmail = () => {
        emailjs.send("service_2jm8iue", "template_ag201b9", {
            name: userData.username,
        }, '7E1QUrPpZ_ri8eIqo').then((result) => {
            console.log(result);
        }, (error) => {
            console.log(error.text);
        });
    };
    if (userData.dob.slice(5, 10) === nextdate.slice(5, 10)) {
        console.log("happy birthday")
        //send email to admin
        // sendAdminEmail()
    }

    if (isHoliday(formatdate)) {
        console.log(getOccasion(formatdate))
    }

    return (
        <div>
  
        </div>
    )
}

export default HolidayEmail