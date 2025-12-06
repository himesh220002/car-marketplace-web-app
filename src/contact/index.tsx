import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { FiChevronDown, FiChevronUp, FiMapPin as MapPin, FiPhone as Phone, FiMail as Mail, FiCheckCircle as CheckCircle } from 'react-icons/fi'
import { FaWhatsapp, FaTelegramPlane } from 'react-icons/fa'

import { useState } from 'react'
import { toast } from 'sonner'

function Contact() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SHEET_WEB_APP_URL;

        /*inside Code.gs we used - 
        function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    // Parse the JSON data sent from the React app
    var data = JSON.parse(e.postData.contents);
    
    // Add the row
    sheet.appendRow([new Date(), data.firstName, data.lastName, data.email, data.message]);
    
    return ContentService.createTextOutput(JSON.stringify({"result":"success", "data": data}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({"result":"error", "error": error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("The Web App is running! Send a POST request to submit data.");
}*/

        if (!GOOGLE_SCRIPT_URL) {
            toast.error("Google Sheet URL is missing in .env!");
            setLoading(false);
            return;
        }

        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors", // Important for Google Apps Script
                headers: {
                    "Content-Type": "text/plain;charset=utf-8",
                },
                body: JSON.stringify(formData),
            });

            setSubmitted(true);
            toast.success("Message sent successfully!");
            setFormData({ firstName: '', lastName: '', email: '', message: '' });
        } catch (error) {
            console.error("Error submitting form", error);
            toast.error("Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const faqs = [
        { q: "How do I list my car?", a: "Simply create an account, go to 'Sell Your Car', and follow the step-by-step guide to upload photos and details." },
        { q: "How do inspections work?", a: "We send a certified mechanic to your location to perform a 150-point inspection. You get the report within 24 hours." },
        { q: "Is financing available?", a: "Yes! We partner with top banks to offer competitive interest rates and instant approval for eligible buyers." },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Header />

            {/* Hero Section */}
            <div className="bg-slate-900 text-white py-20 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000')] bg-cover bg-center opacity-10"></div>
                <div className="relative z-10 container mx-auto px-4">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Get in Touch
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Our support team is available 7 days a week to assist with listings, financing, and inspections. We reply within 24 hours.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-5 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-7xl mx-auto">

                    {/* Left Column: Contact Info & Map */}
                    <div className="space-y-10">
                        {/* Contact Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="group p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                                    <MapPin className="text-xl" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Visit Us</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">
                                    123 Car Street, Automotive City<br />Bangalore, Karnataka
                                </p>
                            </a>

                            <a href="tel:+918105542318" className="group p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all">
                                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                                    <Phone className="text-xl" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Call Us</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">
                                    +91 8105542318<br />Mon-Sun: 9am - 8pm
                                </p>
                            </a>

                            <a href="mailto:versionname4@gmail.com" className="group p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all md:col-span-2">
                                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center text-pink-600 mb-4 group-hover:scale-110 transition-transform">
                                    <Mail className="text-xl" />
                                </div>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">Email Us</h3>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm">versionname4@gmail.com</p>
                                    </div>
                                    <div className="text-slate-400 group-hover:text-pink-600 transition-colors">
                                        Send Mail &rarr;
                                    </div>
                                </div>
                            </a>
                        </div>

                        {/* Social Proof */}
                        <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <img key={i} src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900" />
                                    ))}
                                </div>
                                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    10,000+ Happy Customers
                                </div>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 text-sm italic">
                                "The support team was incredibly helpful in guiding me through the financing process." - <span className="font-semibold">Rahul S.</span>
                            </p>
                        </div>

                        {/* Map Embed */}
                        <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 h-[300px]">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.003673056767!2d77.5945627!3d12.9715987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1716300000000!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>

                    {/* Right Column: Form & FAQs */}
                    <div className="space-y-10">
                        {/* Contact Form */}
                        <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 relative overflow-hidden">
                            {submitted ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-slate-900 z-20 animate-in fade-in duration-500">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
                                        <CheckCircle className="text-4xl" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                                    <p className="text-slate-600 text-center max-w-xs mb-8">
                                        Thank you for reaching out. We'll get back to you within 24 hours.
                                    </p>
                                    <Button onClick={() => setSubmitted(false)} variant="outline">
                                        Send Another Message
                                    </Button>
                                </div>
                            ) : null}

                            <div className="mb-8">
                                <h2 className="text-2xl font-bold mb-2">Send us a Message</h2>
                                <p className="text-slate-500 text-sm">We usually respond within a few hours.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">First Name</label>
                                        <Input
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            placeholder="John"
                                            required
                                            className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Last Name</label>
                                        <Input
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            placeholder="Doe"
                                            required
                                            className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <Input
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@example.com"
                                        required
                                        className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Message</label>
                                    <Textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="How can we help you?"
                                        className="min-h-[150px] bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg rounded-xl disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Sending...
                                        </span>
                                    ) : 'Send Message'}
                                </Button>
                            </form>

                            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                                <p className="text-center text-sm text-slate-500 mb-4">Or chat with us instantly</p>
                                <div className="flex gap-4 justify-center">
                                    <a href="https://wa.me/918105542318" target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" className="gap-2 border-green-200 hover:bg-green-50 text-green-600 hover:text-green-700">
                                            <FaWhatsapp className="text-xl" /> WhatsApp
                                        </Button>
                                    </a>
                                    <a href="https://t.me/+918105542318" target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" className="gap-2 border-blue-200 hover:bg-blue-50 text-blue-500 hover:text-blue-600">
                                            <FaTelegramPlane className="text-xl" /> Telegram
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* FAQs */}
                        <div>
                            <h3 className="text-xl font-bold mb-6">Frequently Asked Questions</h3>
                            <div className="space-y-4">
                                {faqs.map((faq, index) => (
                                    <div key={index} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                                        <button
                                            onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                            className="w-full flex justify-between items-center p-4 text-left font-medium hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                        >
                                            {faq.q}
                                            {openFaq === index ? <FiChevronUp /> : <FiChevronDown />}
                                        </button>
                                        {openFaq === index && (
                                            <div className="p-4 pt-0 text-slate-600 dark:text-slate-400 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                                                {faq.a}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Contact
