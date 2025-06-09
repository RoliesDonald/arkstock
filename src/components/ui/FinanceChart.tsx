"use client";
import Image from "next/image";
import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  {
    month: "January",
    income: 4000,
    expense: 2400,
    ar: 2400,
  },
  {
    month: "February",
    income: 3000,
    expense: 1398,
    ar: 2210,
  },
  {
    month: "March",
    income: 2000,
    expense: 9800,
    ar: 2290,
  },
  {
    month: "Mai",
    income: 2780,
    expense: 3908,
    ar: 2000,
  },
];

const FinanceChart = () => {
  return (
    <div className="bg-slate-100/30 rounded-xl w-full h-full p-4 shadow-lg  border-t-2">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-slate-500">Finance</h1>
        <Image
          src="/moreDark.png"
          alt="more"
          width={20}
          height={20}
          className="cursor-pointer rotate-90"
        />
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#d1d5db" }}
            tickMargin={10}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: "#d1d5db" }}
            tickLine={false}
            tickMargin={20}
          />
          <Tooltip />
          <Legend
            iconType="circle"
            align="center"
            verticalAlign="bottom"
            wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }}
          />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="expense" stroke="#82ca9d" />
          <Line type="monotone" dataKey="ar" stroke="#12ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinanceChart;
