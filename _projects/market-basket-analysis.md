---
layout: project
title: "Data-Driven Market Basket Analytics Pipeline"
description: "An adaptive analytics engine designed to extract structural purchase patterns from massive e-commerce transactional logs. Bypasses textbook guesswork by utilizing distribution percentiles to programmatically determine a 1.71% support floor and executing an empirical confidence sweep to locate the operational 'elbow' optimization zone."
category: "MSc Data Science Project"
status: "Completed"
technologies:
  - R Script
  - Apriori Engine
  - Sparse Matrices
  - Hyperparameters
metric_val: "167"
metric_label: "Rules Discovered"
github: "https://github.com/goyumsamuditha/online-retail-mba.git"
featured: true
order: 4
---

## Project Overview
Association rule mining engine optimized for large-scale e-commerce transaction sets, replacing subjective thresholding with empirical distribution percentiles.

## Execution
- Converted transaction logs into binary sparse incident matrices.
- Tuned Apriori support and confidence thresholds to isolate high-lift rule dependencies.
- Generated 167 actionable co-purchase rules for cross-selling strategies.