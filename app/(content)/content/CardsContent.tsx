"use client";

import { motion } from "framer-motion";
import {
  Plus,
  CreditCard,
  User,
  Building,
  Heart,
  Gift,
  Calendar,
} from "lucide-react";

export default function CardsContent() {
  const cardTypes = [
    {
      name: "Business Cards",
      icon: Building,
      count: 156,
      color: "bg-blue-500",
      description: "Professional business cards",
    },
    {
      name: "Greeting Cards",
      icon: Heart,
      count: 89,
      color: "bg-pink-500",
      description: "Personal greeting cards",
    },
    {
      name: "Gift Cards",
      icon: Gift,
      count: 45,
      color: "bg-green-500",
      description: "Gift and voucher cards",
    },
    {
      name: "Event Cards",
      icon: Calendar,
      count: 67,
      color: "bg-purple-500",
      description: "Event invitations",
    },
    {
      name: "ID Cards",
      icon: User,
      count: 34,
      color: "bg-orange-500",
      description: "Identification cards",
    },
    {
      name: "Membership Cards",
      icon: CreditCard,
      count: 23,
      color: "bg-teal-500",
      description: "Membership and loyalty cards",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen p-8 bg-white max-w-full overflow-hidden"
      style={{ paddingTop: "2rem" }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Card Templates
          </h1>
          <p className="text-lg text-gray-600">
            Professional card designs for every purpose and occasion
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {cardTypes.map((cardType, index) => (
            <motion.div
              key={cardType.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 cursor-pointer group"
            >
              <div
                className={`w-16 h-16 ${cardType.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <cardType.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {cardType.name}
              </h3>
              <p className="text-gray-600 mb-4">{cardType.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {cardType.count} templates
                </span>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  View All →
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-8 border border-indigo-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Card Design Studio
            </h2>
            <p className="text-gray-600 mb-6">
              Create custom cards with our advanced design tools and templates.
            </p>
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 mx-auto">
              <Plus className="w-5 h-5" />
              Create New Card
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
