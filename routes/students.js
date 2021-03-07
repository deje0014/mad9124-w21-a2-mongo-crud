const express = require('express')
const router = express.Router()
const sanitizeMongo = require('express-mongo-sanitize')
const sanitizeBody = require('../middleware/sanitizeBody')
const Student = require('../models/Student')

router.get('/', async (req, res) => {
    const student = await Student.find()
    res.send({data: student})
})

// POST
router.post('/', sanitizeMongo(), sanitizeBody, async (req, res) => {
    let newStudent = new Student(req.sanitizedBody)
    await newStudent.save()
    res.status(201).send({data: newStudent})
})

// GET
router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id)
        if (!student) throw new Error('Resource not found')
        res.send({data: student})
      } catch (err) {
        sendResourceNotFound(req, res)
      }
})

// PUT
router.put('/:id', sanitizeMongo(), sanitizeBody, async (req, res) => {
    try {
        const {_id, ...otherAttributes} = req.sanitizedBody
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            {_id: req.params.id, ...otherAttributes},
            {
                new: true,
                overwrite: true,
                runValidators: true
            }
        )
        if(!student) throw new Error('Resource not found')
        res.send({data: student})
    } catch (err){
        sendResourceNotFound(req, res)
    }

})

// Patch
router.patch('/:id', sanitizeMongo(), sanitizeBody, async (req, res) => {
    try {
        const {_id, ...otherAttributes} = req.sanitizedBody
        const student = await Student.findByIdAndUpdate(
          req.params.id,
          {_id: req.params.id, ...otherAttributes},
          {
            new: true,
            runValidators: true
          }
        )
        if (!student) throw new Error('Resource not found')
        res.send({data: student})
      } catch (err) {
        sendResourceNotFound(req, res)
      }

})
// Delete
router.delete('/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndRemove(req.params.id)
        if (!student) throw new Error('Resource not found')
        res.send({data: student})
      } catch (err) {
        sendResourceNotFound(req, res)
      }
})

function sendResourceNotFound(req, res) {
    res.status(404).send({
      errors: [
        {
          status: '404',
          title: 'Resource does not exist',
          description: `We could not find a student with id: ${req.params.id}`
        }
      ]
    })
  }

module.exports = router