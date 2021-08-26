import React, { useEffect, useRef, useState } from 'react';
import * as faceApi from 'face-api.js';
import { Container } from 'reactstrap'
import './faceID.scss'

function FaceID() {
    const videoHeight = 480;
    const videoWidth = 640;
    const [initiallizing, setInitializing] = useState(false);
    const videoRef = useRef();
    const canvasRef = useRef();

    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = process.env.PUBLIC_URL + '/models';
            setInitializing(true);
            Promise.all([
                faceApi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceApi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                faceApi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                faceApi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
            ]).then(startVideo);
        }
        loadModels();
    }, [])

    const startVideo = () => {
        navigator.getUserMedia({
            video: {}
        },
            stream => videoRef.current.srcObject = stream,
            err => console.error('fail' + err))
    }



    const handleVideoOnPlay = () => {
        setInterval(async () => {
            if (initiallizing) {
                setInitializing(false);
            }
            canvasRef.current.innerHTML = faceApi.createCanvasFromMedia(videoRef.current);
            const displaySize = {
                width: videoWidth,
                height: videoHeight
            }
            faceApi.matchDimensions(canvasRef.current, displaySize);
            const detections = await faceApi.detectAllFaces(videoRef.current, new faceApi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
            const resizeDetections = faceApi.resizeResults(detections, displaySize);
            canvasRef.current.getContext('2d').clearRect(0, 0, videoWidth, videoHeight);
            faceApi.draw.drawDetections(canvasRef.current, resizeDetections);
            faceApi.draw.drawFaceLandmarks(canvasRef.current, resizeDetections);
            faceApi.draw.drawFaceExpressions(canvasRef.current, resizeDetections);
            console.log(detections)
        }, 100)
    }

    function loadLabelVideo() {
        const labels = ['Phuc']

        return Promise.all(
            labels.map(async label => {
                const descriptions = []

            })
        )
    }

    return (
        <Container>
            <span>{initiallizing ? 'Initializing' : 'Ready'}</span>
            <div className="display-flex">
                <video ref={videoRef} autoPlay muted height={videoHeight} width={videoWidth} onPlay={handleVideoOnPlay} />
                <canvas ref={canvasRef} className="position-absolute" />
            </div>
        </Container>
    );
}

export default FaceID;