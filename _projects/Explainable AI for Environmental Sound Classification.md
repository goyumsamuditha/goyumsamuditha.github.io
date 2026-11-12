---
| **layout** | project |
| **title** | Explainable AI for Environmental Sound Classification |
| **description** | An end-to-end deep learning system for environmental sound classification using 4,292 audio recordings from the DataSEC dataset. Developed with a PANNs CNN14 neural network, dual classification heads, and uncertainty-aware techniques, integrating confidence calibration, conformal prediction, and Grad-CAM explainability into an interactive Streamlit application. |
| **category** | MSc Artificial Intelligence Project |
| **status** | Completed |
| **technologies** | |
| Python | PyTorch | PANNs CNN14 | Streamlit |
| Deep Learning | CLAP | Scikit-learn | Grad-CAM |
| Conformal Prediction | Audio Processing | LIME | |
| **metric_val** | 92.03% |
| **metric_label** | CNN14 Test Macro-F1 |
| **github** | [Add your project GitHub repository URL] |
| **featured** | true |
| **order** | 3 |

## Project Overview

An explainable and uncertainty-aware environmental sound classification system developed using the DataSEC dataset, containing 4,292 audio recordings across 22 main sound classes and 28 subclasses.

The project investigates specialised neural-network development, model benchmarking, confidence calibration, uncertainty estimation, and explainability to support environmental noise assessment.

## Implementation

- Developed a PANNs CNN14-based neural network with separate main-class and auxiliary subclass classification heads.
- Implemented audio preprocessing, including mono conversion, 32 kHz resampling, and 10-second audio segmentation.
- Conducted controlled experiments involving learning rates, batch sizes, model depth, optimisers, and random seeds.
- Benchmarked CNN14 against an MFCC-based Support Vector Machine and a CLAP linear probe.
- Applied temperature scaling for confidence calibration and conformal prediction for uncertainty-aware outputs.
- Integrated Grad-CAM visualisations and LIME experiments to investigate model explanations.
- Built an interactive Streamlit application for audio upload, classification, confidence inspection, and explanation visualisation.
- Evaluated performance using accuracy, macro-F1, calibration metrics, and additional explainability assessments.
