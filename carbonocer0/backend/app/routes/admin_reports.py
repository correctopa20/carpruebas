from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from datetime import datetime
import os
import pandas as pd
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.user_model import User
from app.models.UserResponse import UserResponse
from app.models.question import Question
from app.dependencies.roles_dependency import admin_required

router = APIRouter(prefix="/admin", tags=["Admin Reports"])

@router.get("/export-report", dependencies=[Depends(admin_required)])
def export_global_report(db: Session = Depends(get_db)):
    try:
        print("📊 Generando reporte global...")
        
        # 🟢 Recolectar datos de huella de carbono por usuario
        user_emissions = (
            db.query(
                UserResponse.user_id,
                func.sum(UserResponse.emission).label('total_emission')
            )
            .group_by(UserResponse.user_id)
            .all()
        )

        if not user_emissions:
            raise HTTPException(status_code=404, detail="No hay datos de huella de carbono disponibles")

        # 🟢 Calcular estadísticas
        total_emission = sum(float(em.total_emission) for em in user_emissions)
        avg_emission = total_emission / len(user_emissions)
        
        # 🟢 Obtener top 5 usuarios con mayor huella
        top_users_emissions = sorted(user_emissions, key=lambda x: x.total_emission, reverse=True)[:5]
        
        # 🟢 Obtener información de usuarios
        top_users = []
        for user_emission in top_users_emissions:
            user = db.query(User).filter(User.id == user_emission.user_id).first()
            if user:
                top_users.append({
                    "username": user.username,
                    "email": user.email,
                    "total_emission": float(user_emission.total_emission)
                })

        # 🟢 Distribución por categorías
        category_emissions = (
            db.query(
                Question.category,
                func.sum(UserResponse.emission).label('total_emission')
            )
            .join(UserResponse, UserResponse.question_id == Question.id)
            .group_by(Question.category)
            .all()
        )

        # 🟢 Crear PDF
        file_path = "reporte_global_carbonocer0.pdf"
        doc = SimpleDocTemplate(file_path, pagesize=letter)
        styles = getSampleStyleSheet()
        elements = []

        # 🧾 ENCABEZADO
        elements.append(Paragraph("📊 Reporte Global - CarbonoCer0", styles["Title"]))
        elements.append(Spacer(1, 12))
        elements.append(Paragraph(f"Fecha de generación: {datetime.now().strftime('%d/%m/%Y %H:%M')}", styles["Normal"]))
        elements.append(Spacer(1, 20))

        # 📈 RESUMEN GENERAL
        elements.append(Paragraph("Resumen General", styles["Heading2"]))
        elements.append(Spacer(1, 12))
        
        summary_data = [
            ["Total de usuarios registrados", f"{len(user_emissions)}"],
            ["Emisiones totales", f"{total_emission:.2f} kg CO₂"],
            ["Promedio por usuario", f"{avg_emission:.2f} kg CO₂"],
            ["Fecha del reporte", datetime.now().strftime('%d/%m/%Y')]
        ]
        
        summary_table = Table(summary_data, colWidths=[250, 150])
        summary_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#166534")),  # Verde oscuro
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("ALIGN", (0, 0), (-1, -1), "LEFT"),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 10),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
            ("BACKGROUND", (0, 1), (-1, -1), colors.HexColor("#f0fdf4")),  # Verde claro
        ]))
        elements.append(summary_table)
        elements.append(Spacer(1, 20))

        # 🏆 TOP 5 USUARIOS CON MAYOR HUELLA
        elements.append(Paragraph("Top 5 - Usuarios con Mayor Huella de Carbono", styles["Heading2"]))
        elements.append(Spacer(1, 12))
        
        top_users_data = [["Usuario", "Email", "Huella Total (kg CO₂)"]]
        for user in top_users:
            top_users_data.append([user["username"], user["email"], f"{user['total_emission']:.2f}"])

        top_table = Table(top_users_data, colWidths=[150, 200, 120])
        top_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#15803d")),  # Verde medio
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 9),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ]))
        elements.append(top_table)
        elements.append(Spacer(1, 20))

        # 📊 DISTRIBUCIÓN POR CATEGORÍAS
        elements.append(Paragraph("Distribución por Categorías", styles["Heading2"]))
        elements.append(Spacer(1, 12))
        
        category_data = [["Categoría", "Emisión Total (kg CO₂)", "Porcentaje"]]
        for cat in category_emissions:
            percentage = (cat.total_emission / total_emission * 100) if total_emission > 0 else 0
            category_data.append([
                cat.category, 
                f"{cat.total_emission:.2f}", 
                f"{percentage:.1f}%"
            ])

        category_table = Table(category_data, colWidths=[200, 150, 100])
        category_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#15803d")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 9),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ]))
        elements.append(category_table)

        # 🎯 GENERAR PDF
        doc.build(elements)
        
        print(f"✅ Reporte generado exitosamente: {file_path}")
        return FileResponse(
            file_path, 
            filename=f"reporte_carbonocer0_{datetime.now().strftime('%Y%m%d_%H%M')}.pdf",
            media_type="application/pdf"
        )

    except Exception as e:
        print(f"❌ Error generando reporte: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generando reporte: {str(e)}")