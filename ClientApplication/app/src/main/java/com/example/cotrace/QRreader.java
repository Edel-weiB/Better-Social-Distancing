package com.example.cotrace;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.Manifest;
import android.content.Context;
import android.content.SharedPreferences;
import android.media.Image;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.budiyev.android.codescanner.CodeScanner;
import com.budiyev.android.codescanner.CodeScannerView;
import com.budiyev.android.codescanner.DecodeCallback;
import com.google.zxing.Result;
import com.karumi.dexter.Dexter;
import com.karumi.dexter.PermissionToken;
import com.karumi.dexter.listener.PermissionDeniedResponse;
import com.karumi.dexter.listener.PermissionGrantedResponse;
import com.karumi.dexter.listener.PermissionRequest;
import com.karumi.dexter.listener.single.PermissionListener;

public class QRreader extends AppCompatActivity {
    CodeScanner codeScanner;
    CodeScannerView scannView;
    Button resultData;
    ImageView qr_flash;
    SharedPreferences locationpref;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_qrreader);
        scannView = findViewById(R.id.scannerView);
        codeScanner = new CodeScanner(this, scannView);
        resultData = findViewById(R.id.qr_result);
        qr_flash = findViewById(R.id.camera_flash);

        locationpref = getSharedPreferences("Location", MODE_PRIVATE);




        codeScanner.setDecodeCallback(new DecodeCallback() {
            @Override
            public void onDecoded(@NonNull final Result results) {

                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        resultData.setText(results.getText());
                        resultData.setVisibility(View.VISIBLE);
                        // show check in location on button
                    }
                });


            }
        });

        scannView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                codeScanner.startPreview();
            }
        });

        //when click to check in
        resultData.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String location_result = resultData.getText().toString();
                System.out.println(location_result); //for testing
                locationpref.edit().putString("loc", location_result).apply();
                // here need to add thank you and check in page etc....

            }
        });

    }

    @Override
    protected void onResume() {
        super.onResume();
        requestForCamera();

    }

    private void requestForCamera() {
        Dexter.withContext(this).withPermission(Manifest.permission.CAMERA).withListener(new PermissionListener() {
            @Override
            public void onPermissionGranted(PermissionGrantedResponse permissionGrantedResponse) {
                codeScanner.startPreview();
            }

            @Override
            public void onPermissionDenied(PermissionDeniedResponse permissionDeniedResponse) {
                Toast.makeText(QRreader.this, "Oi U need to give permission", Toast.LENGTH_LONG).show();

            }

            @Override
            public void onPermissionRationaleShouldBeShown(PermissionRequest permissionRequest, PermissionToken permissionToken) {
                permissionToken.continuePermissionRequest();

            }
        }).check();


    }
}
