import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi'
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

            toast.success("Message sent successfully!");
            setFormData({ firstName: '', lastName: '', email: '', message: '' });
        } catch (error) {
            console.error("Error submitting form", error);
            toast.error("Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Header />

            {/* Hero Section */}
            <div className="bg-slate-50 dark:bg-slate-900 py-20 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Get in Touch
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto px-4">
                    We would love to hear from you. Whether you have a question about a listing, need assistance, or just want to say hello.
                </p>
            </div>

            <div className="container mx-auto px-5 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">

                    {/* Contact Info */}
                    <div className="space-y-10">
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-8">
                                Fill out the form and our team will get back to you within 24 hours.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                                    <FiMapPin className="text-xl" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Our Location</h3>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        123 Car Street, Automotive City<br />
                                        Bangalore, Karnataka, India
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                                    <FiPhone className="text-xl" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Phone Number</h3>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        +91 8105542318
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-lg text-pink-600 dark:text-pink-400">
                                    <FiMail className="text-xl" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Email Address</h3>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        versionname4@gmail.com
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700">
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
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Message</label>
                                <Textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="How can we help you?"
                                    className="min-h-[150px]"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg rounded-xl disabled:opacity-50"
                            >
                                {loading ? 'Sending...' : 'Send Message'}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Contact
