/**
 * CleanRoute AI - Spring Boot Enterprise REST API Specification
 * Provides standard OpenAPI / Swagger 3.0 schema definitions and Java Spring Boot controllers
 * for production deployment with PostgreSQL / PostGIS and Google OR-Tools.
 */

export interface EndpointSpec {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  summary: string;
  description: string;
  requestBodySnippet?: string;
  responseSnippet: string;
}

export const SPRING_BOOT_ENDPOINTS: EndpointSpec[] = [
  {
    method: 'POST',
    path: '/api/v1/complaints/report',
    summary: 'Submit Citizen Waste Complaint with Multimodal AI Inference',
    description: 'Accepts multipart image and GPS coordinates. Calls Gemini Vision model for waste classification, volume estimation, and spatial duplicate verification.',
    requestBodySnippet: `{\n  "latitude": 18.5284,\n  "longitude": 73.8421,\n  "ward": "Ward 04",\n  "description": "Overflowing plastic bottles near market",\n  "image": "<multipart-file>"\n}`,
    responseSnippet: `{\n  "complaintId": "CR-1024",\n  "status": "Assigned",\n  "aiClassification": {\n    "category": "Plastic",\n    "confidence": 0.94,\n    "severity": "High",\n    "duplicateProbability": 0.08,\n    "recommendedAction": "Schedule dedicated dry-waste collection within 3 hours"\n  }\n}`,
  },
  {
    method: 'POST',
    path: '/api/v1/routes/optimize',
    summary: 'Solve Vehicle Routing Problem via Google OR-Tools',
    description: 'Executes Capacitated VRP solver with time windows. Minimizes fuel usage and distance while honoring truck weight/volumetric capacity constraints.',
    requestBodySnippet: `{\n  "vehicleId": "V-102",\n  "depotCoordinates": [18.5204, 73.8567],\n  "maxStops": 10,\n  "timeWindowEnd": "18:00:00"\n}`,
    responseSnippet: `{\n  "vehicleId": "V-102",\n  "stopsCount": 8,\n  "optimizedDistanceKm": 14.2,\n  "estimatedDurationMinutes": 42,\n  "distanceSavedPercent": 18.4,\n  "emissionsAvoidedKgCO2": 4.2\n}`,
  },
  {
    method: 'GET',
    path: '/api/v1/hotspots/predict',
    summary: 'Retrieve Predictive Waste Hotspots',
    description: 'Queries spatio-temporal machine learning model to forecast waste accumulation clusters 24-48 hours ahead based on historical complaint seasonality and ward demographics.',
    responseSnippet: `[\n  {\n    "ward": "Ward 12",\n    "riskLevel": "High",\n    "predictionConfidence": 0.89,\n    "predictedAccumulationHours": 24,\n    "recommendedAction": "Schedule preventive dual-shift wet waste tipper"\n  }\n]`,
  },
  {
    method: 'PATCH',
    path: '/api/v1/complaints/{id}/status',
    summary: 'Update Complaint Status and Assign Vehicle',
    description: 'Transitions complaint lifecycle (Pending -> Assigned -> In Progress -> Resolved). Dispatches real-time WebSocket push notifications to citizens and drivers.',
    requestBodySnippet: `{\n  "status": "Assigned",\n  "vehicleId": "V-102",\n  "notes": "Dispatched to Driver Rahul Sharma"\n}`,
    responseSnippet: `{\n  "complaintId": "CR-1024",\n  "status": "Assigned",\n  "assignedVehicleId": "V-102",\n  "updatedAt": "2026-09-30T09:15:00Z"\n}`,
  },
];

export const SPRING_BOOT_CONTROLLER_CODE = `package com.cleanroute.api.controller;

import com.cleanroute.api.dto.*;
import com.cleanroute.api.service.AiClassificationService;
import com.cleanroute.api.service.OrToolsRouteOptimizationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class CleanRouteMunicipalController {

    private final AiClassificationService aiService;
    private final OrToolsRouteOptimizationService routeOptimizer;

    public CleanRouteMunicipalController(AiClassificationService aiService, 
                                         OrToolsRouteOptimizationService routeOptimizer) {
        this.aiService = aiService;
        this.routeOptimizer = routeOptimizer;
    }

    @PostMapping(value = "/complaints/report", consumes = "multipart/form-data")
    public ResponseEntity<ComplaintResponseDTO> reportWaste(
            @RequestParam("image") MultipartFile image,
            @RequestParam("latitude") Double latitude,
            @RequestParam("longitude") Double longitude,
            @RequestParam("ward") String ward,
            @RequestParam("description") String description) {
        
        // 1. Multimodal Gemini classification & volume estimation
        AiInferenceResult aiResult = aiService.analyzeWasteImage(image, description);
        
        // 2. Spatial duplicate check (PostGIS ST_DWithin 200m buffer)
        boolean isDuplicate = aiService.checkSpatialDuplicate(latitude, longitude, aiResult.getCategory());
        
        // 3. Persist complaint & return enriched telemetry
        ComplaintResponseDTO response = aiService.createComplaintRecord(
            latitude, longitude, ward, description, aiResult, isDuplicate
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/routes/optimize")
    public ResponseEntity<RouteOptimizationResponseDTO> optimizeFleetRoute(
            @RequestBody RouteRequestDTO request) {
        // Invokes Google OR-Tools VRP Solver (C++ bindings via JNI)
        RouteOptimizationResponseDTO optimizedRoute = routeOptimizer.solveVrp(
            request.getVehicleId(), request.getMaxStops()
        );
        return ResponseEntity.ok(optimizedRoute);
    }
}`;
