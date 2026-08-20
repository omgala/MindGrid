const recommendationRules = {

    LOW: [
        {
            title: "Continue monitoring your wellbeing",
            reason:
                "Your current screening score is relatively low. Continuing to monitor how you feel can help identify changes early.",
            priority: 3,
            category: "EMOTIONAL_WELLBEING"
        },
        {
            title: "Explore MindGrid wellness resources",
            reason:
                "Wellbeing resources can help maintain healthy coping strategies and emotional balance.",
            priority: 3,
            category: "STRESS_MANAGEMENT"
        }
    ],

    MODERATE: [
        {
            title: "Consider speaking with a counselor",
            reason:
                "Your screening score indicates that you may benefit from additional emotional or psychological support.",
            priority: 1,
            category: "COUNSELING"
        },
        {
            title: "Explore stress-management resources",
            reason:
                "Stress-management strategies may help with the difficulties reported during the assessment.",
            priority: 2,
            category: "STRESS_MANAGEMENT"
        },
        {
            title: "Monitor your wellbeing",
            reason:
                "Keeping track of changes in your wellbeing can help determine whether additional support is needed.",
            priority: 2,
            category: "EMOTIONAL_WELLBEING"
        }
    ],

    HIGH: [
        {
            title: "Consider contacting a counselor promptly",
            reason:
                "Your screening score indicates a higher level of reported difficulties that may benefit from additional support.",
            priority: 1,
            category: "COUNSELING"
        },
        {
            title: "Explore institutional support services",
            reason:
                "Your institution may provide counseling, student support, or other services that can provide additional assistance.",
            priority: 1,
            category: "COUNSELING"
        },
        {
            title: "Use relevant wellbeing resources",
            reason:
                "Wellbeing resources can provide additional coping strategies while you consider appropriate support.",
            priority: 2,
            category: "EMOTIONAL_WELLBEING"
        }
    ]
};


async function createRecommendations(
    client,
    userId,
    riskLevel
) {

    const rules =
        recommendationRules[riskLevel];


    if (!rules) {

        throw new Error(
            `Unsupported risk level: ${riskLevel}`
        );
    }


    const recommendations = [];


    for (const rule of rules) {

        const resourceResult = await client.query(
            `
            SELECT id
            FROM public.resources
            WHERE category = $1
            AND is_active = true
            ORDER BY created_at DESC
            LIMIT 1
            `,
            [rule.category]
        );


        const resourceId =
            resourceResult.rows.length > 0
                ? resourceResult.rows[0].id
                : null;


        const result = await client.query(
            `
            INSERT INTO public.recommendations
            (
                user_id,
                resource_id,
                title,
                reason,
                priority,
                status
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING
                id,
                user_id,
                resource_id,
                title,
                reason,
                priority,
                status,
                created_at
            `,
            [
                userId,
                resourceId,
                rule.title,
                rule.reason,
                rule.priority,
                "PENDING"
            ]
        );


        recommendations.push(
            result.rows[0]
        );
    }


    return recommendations;
}

async function getStudentRecommendations(userId) {

    const result = await require("../config/database").query(
        `
        SELECT
            r.id,
            r.title,
            r.reason,
            r.priority,
            r.status,
            r.created_at,

            res.id AS resource_id,
            res.title AS resource_title,
            res.description AS resource_description,
            res.category AS resource_category,
            res.content AS resource_content,
            res.resource_url

        FROM public.recommendations r

        LEFT JOIN public.resources res
            ON res.id = r.resource_id
            AND res.is_active = true

        WHERE r.user_id = $1

        ORDER BY
            r.priority ASC,
            r.created_at DESC
        `,
        [userId]
    );

    return result.rows;
}
module.exports = {
    createRecommendations,
    getStudentRecommendations
};