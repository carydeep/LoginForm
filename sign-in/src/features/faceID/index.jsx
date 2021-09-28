import React, { useEffect, useRef, useState } from 'react';
import * as faceApi from 'face-api.js';
import { Button, Container, FormGroup } from 'reactstrap';
import './faceID.scss';
import UserApi from '../../api/userApi';


function FaceID() {
    const videoHeight = 480;
    const videoWidth = 640;
    const [initiallizing, setInitializing] = useState(false);
    const [isCapture, setIsCapture] = useState(true);
    const videoRef = useRef();
    const canvasRef = useRef();
    const img = new Image();

    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = process.env.PUBLIC_URL + '/models';
            setInitializing(true);
            Promise.all([
                faceApi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceApi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                faceApi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                faceApi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
                faceApi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
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

    const offVideo = () => {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => {
            track.stop();
        });
        videoRef.current.srcObject = null;
    }

    const handleVideoOnPlay = async () => {
        const LabeledFaceDescriptors = await loadLabelVideo();
        const faceMatcher = new faceApi.FaceMatcher(LabeledFaceDescriptors, 0.7);

        canvasRef.current.innerHTML = faceApi.createCanvasFromMedia(videoRef.current);
        const displaySize = {
            width: videoWidth,
            height: videoHeight
        }
        faceApi.matchDimensions(canvasRef.current, displaySize);
        setInterval(async () => {
            if (initiallizing) {
                setInitializing(false);
            }

            const detections = await faceApi.detectAllFaces(videoRef.current, new faceApi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
            console.log(detections);

            const resizeDetections = faceApi.resizeResults(detections, displaySize);
            // console.log(faceMatcher.findBestMatch(resizeDetections));

            canvasRef.current.getContext('2d').clearRect(0, 0, videoWidth, videoHeight);
            const faceRecognition = resizeDetections.map((d) => {
                return faceMatcher.findBestMatch(d.descriptor);
            })

            faceRecognition.forEach((result, i) => {
                const box = resizeDetections[i].detection.box;
                const drawBox = new faceApi.draw.DrawBox(box, { label: result.toString() })
                drawBox.draw(canvasRef.current);
            })


            // faceApi.draw.drawDetections(canvasRef.current, resizeDetections);
            // faceApi.draw.drawFaceLandmarks(canvasRef.current, resizeDetections);
            // faceApi.draw.drawFaceExpressions(canvasRef.current, resizeDetections);
        }, 200)
    }

    async function loadLabelVideo() {
        const labels = ['EmmaWason', 'Phuc'];

        // return Promise.all(
        //     labels.map(async label => {
        //         const descriptions = [];
        //         for (let i = 1; i <= 2; i++) {
        //             const img = await faceApi.fetchImage(`http://127.0.0.1:5500/images/labels_images/${label}/${i}.jpg`);
        //             const detections = await faceApi.detectSingleFace(img, new faceApi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
        //             descriptions.push(detections.descriptor);
        //             // console.log(detections);
        //         }
        //         document.body.append('Faces Loaded');
        //         return new faceApi.LabeledFaceDescriptors(label, descriptions);

        //     })
        // )

        const LabeledFaceDescriptors = await UserApi.getFace();
        return Promise.all(
            LabeledFaceDescriptors[0].map(async label => {
                const descriptions = [];
                for (let i = 0; i <= 1; i++) {
                    const descriptionsA = label.descriptors[i];
                    const descriptions32 = new Float32Array(descriptionsA);
                    descriptions.push(descriptions32);
                    // console.log(detections);
                }
                document.body.append('Faces Loaded');
                return new faceApi.LabeledFaceDescriptors(label.label, descriptions);

            })
        )
    }

    const handleOnClick = () => {
        canvasRef.current.getContext('2d').clearRect(0, 0, videoWidth, videoHeight);
        canvasRef.current.getContext('2d').drawImage(videoRef.current, 0, 0);
        img.src = canvasRef.current.toDataURL();
        setIsCapture(false);
        offVideo();
    }

    const reCapture = () => {
        startVideo();
        canvasRef.current.getContext('2d').clearRect(0, 0, videoWidth, videoHeight);
        setIsCapture(true);
    }

    return (
        <Container>
            <span>{initiallizing ? 'Initializing' : 'Ready'}</span>
            <div className="display-flex">
                <video ref={videoRef} autoPlay muted height={videoHeight} width={videoWidth} onPlay={handleVideoOnPlay} />
                <canvas className="position-absolute" ref={canvasRef} height={videoHeight} width={videoWidth} />
            </div>
            <FormGroup>
                {/* {(isCapture) ? <Button type="submit" onClick={handleOnClick}>Capture</Button> : <Button type="submit" onClick={reCapture}>Re-Capture</Button>} */}
                <Button type="submit" >Upload</Button>
            </FormGroup>
        </Container>
    );
}

export default FaceID;