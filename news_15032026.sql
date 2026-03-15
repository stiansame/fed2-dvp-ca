CREATE DATABASE  IF NOT EXISTS `news` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `news`;
-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: news
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `articles`
--

DROP TABLE IF EXISTS `articles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `articles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `body` text NOT NULL,
  `submitted_by` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `category` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `submitted_by` (`submitted_by`),
  CONSTRAINT `articles_ibfk_1` FOREIGN KEY (`submitted_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `articles`
--

LOCK TABLES `articles` WRITE;
/*!40000 ALTER TABLE `articles` DISABLE KEYS */;
INSERT INTO `articles` VALUES (32,'Understanding SQL Indexes','A practical introduction to indexes and how they improve database performance.',12,'2026-03-14 09:50:32','database'),(33,'Async Programming Basics','Exploring the benefits of asynchronous code and common patterns used in modern apps.',7,'2026-03-14 09:50:32','backend'),(34,'Why Clean Code Matters','Writing readable and maintainable code makes collaboration easier and systems more reliable.',18,'2026-03-14 09:50:32','general'),(35,'REST API Design Tips','Guidelines for building predictable and scalable REST APIs.',5,'2026-03-14 09:50:32','api'),(36,'Scaling Web Applications','Strategies for handling increasing traffic in modern web services.',1,'2026-03-14 09:50:32','performance'),(37,'Debugging Like a Pro','Tools and techniques developers use to track down tricky bugs.',14,'2026-03-14 09:50:32','general'),(38,'Intro to Database Normalization','Understanding normalization and why it prevents redundant data.',6,'2026-03-14 09:50:32','database'),(39,'Microservices vs Monoliths','Comparing architectural patterns for large scale applications.',9,'2026-03-14 09:50:32','architecture'),(40,'Caching Strategies Explained','When and how to use caching to improve application performance.',20,'2026-03-14 09:50:32','performance'),(41,'A Guide to Docker Basics','Containerization fundamentals and why developers love Docker.',11,'2026-03-14 09:50:32','devops'),(42,'Understanding Event Driven Systems','How event-driven architecture enables scalable systems.',4,'2026-03-14 09:50:32','architecture'),(43,'Secure Password Storage','Best practices for hashing and protecting user credentials.',16,'2026-03-14 09:50:32','security'),(44,'Improving Query Performance','Analyzing slow queries and optimizing database workloads.',2,'2026-03-14 09:50:32','database'),(45,'Getting Started with ORMs','How Object Relational Mappers simplify database access.',13,'2026-03-14 09:50:32','backend'),(46,'The Power of Logging','Why structured logs are essential for monitoring production systems.',17,'2026-03-14 09:50:32','api'),(47,'Intro to GraphQL','Understanding how GraphQL differs from traditional REST APIs.',8,'2026-03-14 09:50:32','api'),(48,'Continuous Integration Basics','Automating testing and deployment pipelines.',15,'2026-03-14 09:50:32','devops'),(49,'Monitoring Modern Systems','Observability tools and metrics every developer should know.',19,'2026-03-14 09:50:32','devops'),(50,'Designing Scalable Databases','Choosing the right database architecture for growth.',10,'2026-03-14 09:50:32','database'),(51,'Writing Effective Unit Tests','How testing improves reliability and developer confidence.',6,'2026-03-14 09:50:32','testing'),(52,'Handling Concurrency','Common patterns for managing concurrent processes.',1,'2026-03-14 09:50:32','backend'),(53,'Understanding Message Queues','Using queues to decouple services and improve reliability.',12,'2026-03-14 09:50:32','architecture'),(54,'Feature Flags in Production','Safely rolling out new features using feature toggles.',18,'2026-03-14 09:50:32','api'),(55,'Intro to Serverless','How serverless platforms simplify infrastructure management.',9,'2026-03-14 09:50:32','devops'),(56,'Database Migration Strategies','Managing schema changes without downtime.',14,'2026-03-14 09:50:32','database'),(57,'Search Implementation Basics','Adding full-text search capabilities to applications.',4,'2026-03-14 09:50:32','api'),(58,'Error Handling Patterns','Designing systems that fail gracefully.',7,'2026-03-14 09:50:32','backend'),(59,'Working with JSON in SQL','Modern SQL features for handling structured JSON data.',20,'2026-03-14 09:50:32','database'),(60,'Optimizing API Responses','Reducing payload size and improving API performance.',11,'2026-03-14 09:50:32','performance'),(61,'Versioning Your APIs','Techniques for maintaining backward compatibility.',5,'2026-03-14 09:50:32','api'),(62,'Adding posts using Postman','This is entirely possible while testing, and is encouraged. For testing, that is.',23,'2026-03-14 19:56:05','general'),(63,'Getting Started with GitHub for Version Control','GitHub is a platform that helps developers store, manage, and collaborate on code using Git.',24,'2026-03-15 09:45:11','devops');
/*!40000 ALTER TABLE `articles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `password_hash` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'stianrostad','hei@stianrostad.no','2026-03-12 18:50:08',''),(2,'Ole','ole@example.com','2026-03-12 18:50:08',''),(4,'sarah','sarah@example.com','2026-03-13 15:46:13',''),(5,'alex_walker','alex.walker@example.com','2026-03-14 09:44:41',''),(6,'julia_hansen','julia.hansen@example.com','2026-03-14 09:44:41',''),(7,'markus_lind','markus.lind@example.com','2026-03-14 09:44:41',''),(8,'sarah_connor','sarah.connor@example.com','2026-03-14 09:44:41',''),(9,'daniel_kim','daniel.kim@example.com','2026-03-14 09:44:41',''),(10,'nina_patel','nina.patel@example.com','2026-03-14 09:44:41',''),(11,'oscar_berg','oscar.berg@example.com','2026-03-14 09:44:41',''),(12,'lucas_meyer','lucas.meyer@example.com','2026-03-14 09:44:41',''),(13,'emma_roberts','emma.roberts@example.com','2026-03-14 09:44:41',''),(14,'noah_jensen','noah.jensen@example.com','2026-03-14 09:44:41',''),(15,'olivia_smith','olivia.smith@example.com','2026-03-14 09:44:41',''),(16,'liam','liam.davis@example.com','2026-03-14 09:44:41',''),(17,'mia_clark','mia.clark@example.com','2026-03-14 09:44:41',''),(18,'ethan_wilson','ethan.wilson@example.com','2026-03-14 09:44:41',''),(19,'ava','ava.martin@example.com','2026-03-14 09:44:41',''),(20,'henry_andersen','henry.andersen@example.com','2026-03-14 09:44:41',''),(21,'Flaca','flaca.gutierrez@example.com','2026-03-14 15:48:50',''),(23,'stian','stianrostad@gmail.com','2026-03-14 19:43:58','$2b$10$gyMNw2DDpYEd6gWff8v5yOiZKjR/z2pY2F/9l3ieXts1II94YbEkq'),(24,'tylerdurden','tyler@bestsoaps.com','2026-03-15 09:28:22','$2b$10$LqvW/XBxUtBonxjU9HBUXe/OcffybQjD.RjTWjCUXovS7u68m.TsS');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-15 13:47:52
