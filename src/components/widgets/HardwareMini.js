import React from 'react'
import { motion } from 'framer-motion'
import '../../styles/widgets/HardwareMini.css'
import { useDispatch, useSelector } from 'react-redux';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

function HardwareMini() {

  const systemauth = useSelector(state => state.systemauth)
  const cpuregisters = useSelector(state => state.cpuregisters)
  const memoryregisters = useSelector(state => state.memoryregisters)
  const dispatch = useDispatch()

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels:{
          color: "white"
        }
      }
    },
    scales: {
      y: {
          max: 100,
          min: 0,
          ticks: {
              stepSize: 10,
              color: "white"
          }
      }
    }
  };

  const labels = cpuregisters.map((cpur, i) => cpur.time)

  const data = {
    labels,
    datasets: [
      {
        label: 'CPU',
        data: cpuregisters.map((cpur, i) => cpur.register),
        borderColor: 'cyan',
        backgroundColor: 'cyan',
      },
      {
        label: 'Memory',
        data: memoryregisters.map((cpur, i) => cpur.register),
        borderColor: 'orange',
        backgroundColor: 'orange',
      }
    ],
  }

  return (
    <motion.div
        animate={{
          right: systemauth.status? "5px" : "-1000px"
        }}
        transition={{
          duration: 1,
          delay: 1.5
        }}
        id='div_hardware_usage'>
          <div id='div_hu_header'>
            <p id='p_fs_label'>Hardwares</p>
          </div>
          <div id='div_graph_container'>
            <Line options={options} data={data} />
          </div>
    </motion.div>
  )
}

export default HardwareMini